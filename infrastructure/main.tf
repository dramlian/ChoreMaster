terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "azurerm" {
  features {}
  subscription_id = "d7bdc919-2a15-490a-ae37-699b54023f7a"
}

# Resource Group
resource "azurerm_resource_group" "choremaster" {
  name     = "choremaster"
  location = "West Europe"

  tags = {
    environment = "test"
    owner       = "Damian"
  }
}

variable "db_password" {
  type      = string
  sensitive = true
}

# Random ID for Key Vault
resource "random_id" "kv_suffix" {
  byte_length = 4
}

data "azurerm_client_config" "current" {}

# Key Vault
resource "azurerm_key_vault" "choremaster_kv" {
  name                = "choremaster-kv-${random_id.kv_suffix.hex}"
  location            = azurerm_resource_group.choremaster.location
  resource_group_name = azurerm_resource_group.choremaster.name
  sku_name            = "standard"
  tenant_id           = data.azurerm_client_config.current.tenant_id
}

# Secret
resource "azurerm_key_vault_secret" "db_password" {
  name         = "DbPassword"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.choremaster_kv.id
}

# Managed Identity
resource "azurerm_user_assigned_identity" "choremaster_identity" {
  name                = "choremaster-identity"
  resource_group_name = azurerm_resource_group.choremaster.name
  location            = azurerm_resource_group.choremaster.location
}

resource "azurerm_key_vault_access_policy" "terraform_user" {
  key_vault_id = azurerm_key_vault.choremaster_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id 

  secret_permissions = ["Get", "List", "Set"]
}

# Key Vault Access Policy for Identity
resource "azurerm_key_vault_access_policy" "identity_policy" {
  key_vault_id = azurerm_key_vault.choremaster_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_user_assigned_identity.choremaster_identity.principal_id

  secret_permissions = ["Get", "List"]
}

# Container App Environment
resource "azurerm_container_app_environment" "choremaster_env" {
  name                = "choremaster-env"
  location            = azurerm_resource_group.choremaster.location
  resource_group_name = azurerm_resource_group.choremaster.name
}

# Container App (backend)
resource "azurerm_container_app" "choremaster_app" {
  name                         = "choremaster-backend"
  resource_group_name          = azurerm_resource_group.choremaster.name
  container_app_environment_id = azurerm_container_app_environment.choremaster_env.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.choremaster_identity.id]
  }

  template {
    container {
      name   = "choremaster-backend"
      image  = "docker.io/dramlian/choremaster-backend:latest"
      cpu    = 0.5
      memory = "1Gi"
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# Container App for frontend
resource "azurerm_container_app" "choremaster_frontend" {
  name                         = "choremaster-frontend"
  resource_group_name          = azurerm_resource_group.choremaster.name
  container_app_environment_id = azurerm_container_app_environment.choremaster_env.id
  revision_mode                = "Single"

  template {
    container {
      name   = "choremaster-frontend"
      image  = "docker.io/dramlian/choremaster-frontend:latest"
      cpu    = 0.25
      memory = "0.5Gi"
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    external_enabled = true
    target_port      = 80
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# Outputs
output "choremaster_backend_url" {
  value = "https://${azurerm_container_app.choremaster_app.latest_revision_fqdn}"
}

output "choremaster_frontend_url" {
  value = azurerm_container_app.choremaster_frontend.latest_revision_fqdn
}

output "keyvault_uri" {
  value = azurerm_key_vault.choremaster_kv.vault_uri
}
