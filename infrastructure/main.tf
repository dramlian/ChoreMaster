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

variable "google_client_id" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
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
        value = var.google_client_id
      }

      env {
        name  = "ConnectionStrings__DefaultConnection"
        value = var.db_password
      }
    }
    
    # Scaling configuration moved inside template block
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

      env {
        name  = "VITE_GOOGLE_CLIENT_ID"
        value = var.google_client_id
      }
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    external_enabled = true
    target_port      = 80   # nginx serves on port 80
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

# Output the public URL for frontend
output "choremaster_frontend_url" {
  value = azurerm_container_app.choremaster_frontend.latest_revision_fqdn
}