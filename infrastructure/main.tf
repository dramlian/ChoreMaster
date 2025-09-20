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

# Container App Environment
resource "azurerm_container_app_environment" "choremaster_env" {
  name                = "choremaster-env"
  location            = azurerm_resource_group.choremaster.location
  resource_group_name = azurerm_resource_group.choremaster.name
}

# Container App (your backend)
resource "azurerm_container_app" "choremaster_app" {
  name                         = "choremaster-backend"
  resource_group_name          = azurerm_resource_group.choremaster.name
  container_app_environment_id = azurerm_container_app_environment.choremaster_env.id
  revision_mode                = "Single"

  template {
    container {
      name   = "choremaster-backend"
      image  = "docker.io/dramlian/choremaster-backend:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "GOOGLE_CLIENT_ID"
        value = ""
      }

      env {
        name  = "ConnectionStrings__DefaultConnection"
        value = ""
      }
    }
    
    # Scaling configuration moved inside template block
    min_replicas = 0
    max_replicas = 2
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

# Output the public URL
output "choremaster_backend_url" {
  value = "https://${azurerm_container_app.choremaster_app.latest_revision_fqdn}"
}