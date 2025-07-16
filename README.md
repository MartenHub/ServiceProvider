# ServiceProvider
Generate and use your own custom microservices, easy to use and easy to create systems.
                        ┌────────────────────────────────────┐
                        │            Frontend UI             │
                        │ (User selects services, customizes │
                        │  models, configures deployment)    │
                        └────────────────────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────────┐
                        │      Express.js Backend      │  ← REST API & Auth Gateway
                        │   - User auth, session       │
                        │   - YAML validation, parsing │
                        │   - Request coordination     │
                        └────────────┬─────────────────┘
                                     │
         ┌───────────────────────────┴──────────────────────────┐
         ▼                                                      ▼
┌─────────────────────┐                            ┌─────────────────────────┐
│   Golang Code Gen   │                            │   Rust Code Generator   │
│ - Templating engine │                            │ - Fast binary handling  │
│ - Service combiner  │                            │ - Deployment builders   │
│ - Manual generator  │                            └─────────────────────────┘
└─────────────────────┘
         ▼
 ┌────────────────────────────────────┐
 │ Generated repo with code + YAML   │
 │ + README for deployment           │
 └────────────────────────────────────┘
