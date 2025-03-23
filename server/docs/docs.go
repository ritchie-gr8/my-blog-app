// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/authentication/token": {
            "post": {
                "description": "Create a token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "authentication"
                ],
                "summary": "Create a token",
                "parameters": [
                    {
                        "description": "User credentials",
                        "name": "payload",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/main.CreateUserTokenPayload"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Token",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {}
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {}
                    }
                }
            }
        },
        "/authentication/user": {
            "post": {
                "description": "Register a user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "authentication"
                ],
                "summary": "Register a user",
                "parameters": [
                    {
                        "description": "User credentials",
                        "name": "payload",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/main.RegisterUserPayload"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "User registered",
                        "schema": {
                            "$ref": "#/definitions/main.UserWithToken"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {}
                    }
                }
            }
        },
        "/comments": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Create a new comment on a post with the provided details",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "comments"
                ],
                "summary": "Create a new comment",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Post ID",
                        "name": "postID",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "User ID",
                        "name": "user_id",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "integer"
                        }
                    },
                    {
                        "maxLength": 300,
                        "description": "Comment Content",
                        "name": "content",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Successfully created comment",
                        "schema": {
                            "$ref": "#/definitions/store.Comment"
                        }
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            }
        },
        "/feed": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Retrieve a paginated feed of posts with optional filters for category and search",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "posts"
                ],
                "summary": "Get post feed",
                "parameters": [
                    {
                        "maximum": 20,
                        "minimum": 1,
                        "type": "integer",
                        "description": "Number of posts to retrieve (default is 20, max is 20)",
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "description": "Offset for pagination (default is 0)",
                        "name": "offset",
                        "in": "query"
                    },
                    {
                        "type": "string",
                        "description": "Sort order (default is 'desc', options are 'asc' or 'desc')",
                        "name": "sort",
                        "in": "query"
                    },
                    {
                        "type": "string",
                        "description": "Category to filter posts by",
                        "name": "category",
                        "in": "query"
                    },
                    {
                        "type": "string",
                        "description": "Search term to filter posts by (max length is 100)",
                        "name": "search",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successfully retrieved the posts feed",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/store.FeedItem"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            }
        },
        "/health": {
            "get": {
                "description": "Check the health status of the server, environment, and version",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "health"
                ],
                "summary": "Health check",
                "responses": {
                    "200": {
                        "description": "Returns server health status, environment, and version",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            }
        },
        "/posts": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Creates a new post with the provided details",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "posts"
                ],
                "summary": "Create a post",
                "parameters": [
                    {
                        "maxLength": 100,
                        "description": "Post Title",
                        "name": "title",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 120,
                        "description": "Post Introduction",
                        "name": "introduction",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 1000,
                        "description": "Post Content",
                        "name": "content",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 100,
                        "description": "Post Category",
                        "name": "category",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "description": "Thumbnail Image",
                        "name": "thumbnail_image",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Successfully created post",
                        "schema": {
                            "$ref": "#/definitions/store.Post"
                        }
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            }
        },
        "/posts/{postID}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Retrieve a post along with its comments",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "posts"
                ],
                "summary": "Get a post",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Post ID",
                        "name": "postID",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successfully fetched post",
                        "schema": {
                            "$ref": "#/definitions/store.Post"
                        }
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "404": {
                        "description": "Post not found",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            },
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update an existing post with new details",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "posts"
                ],
                "summary": "Update a post",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Post ID",
                        "name": "postID",
                        "in": "path",
                        "required": true
                    },
                    {
                        "maxLength": 100,
                        "description": "Post Title",
                        "name": "title",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 120,
                        "description": "Post Introduction",
                        "name": "introduction",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 1000,
                        "description": "Post Content",
                        "name": "content",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "maxLength": 100,
                        "description": "Post Category",
                        "name": "category",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "description": "Thumbnail Image",
                        "name": "thumbnail_image",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successfully updated post",
                        "schema": {
                            "$ref": "#/definitions/store.Post"
                        }
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "404": {
                        "description": "Post not found",
                        "schema": {}
                    },
                    "409": {
                        "description": "Conflict: The request could not be completed due to a conflict",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Delete a post by its ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "posts"
                ],
                "summary": "Delete a post",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Post ID",
                        "name": "postID",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "204": {
                        "description": "No Content\"\t\"Successfully deleted post, no content returned"
                    },
                    "400": {
                        "description": "Invalid request, the request data was incorrect or malformed",
                        "schema": {}
                    },
                    "404": {
                        "description": "Post not found",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal server error, the server encountered a problem",
                        "schema": {}
                    }
                }
            }
        },
        "/users/activate/{token}": {
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Activate/Register a user by invitation token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Activate/Register a user",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Invitation token",
                        "name": "token",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "204": {
                        "description": "User activated",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {}
                    }
                }
            }
        },
        "/users/{id}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Fetch a user profile by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Fetch a user profile",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "User ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/store.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {}
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {}
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {}
                    }
                }
            }
        }
    },
    "definitions": {
        "main.CreateUserTokenPayload": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "maxLength": 255
                },
                "password": {
                    "type": "string",
                    "maxLength": 72,
                    "minLength": 3
                }
            }
        },
        "main.RegisterUserPayload": {
            "type": "object",
            "required": [
                "email",
                "name",
                "password",
                "username"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "maxLength": 255
                },
                "name": {
                    "type": "string",
                    "maxLength": 100
                },
                "password": {
                    "type": "string",
                    "maxLength": 72,
                    "minLength": 3
                },
                "username": {
                    "type": "string",
                    "maxLength": 100
                }
            }
        },
        "main.UserWithToken": {
            "type": "object",
            "properties": {
                "bio": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "is_active": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                },
                "profile_picture": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "role": {
                    "type": "string"
                },
                "token": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "store.Comment": {
            "type": "object",
            "properties": {
                "content": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "post_id": {
                    "type": "integer"
                },
                "user": {
                    "$ref": "#/definitions/store.User"
                },
                "user_id": {
                    "type": "integer"
                }
            }
        },
        "store.FeedItem": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "introduction": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "thumbnail_image": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "title": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                },
                "user_id": {
                    "type": "integer"
                }
            }
        },
        "store.Post": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string"
                },
                "comments": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/store.Comment"
                    }
                },
                "content": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "introduction": {
                    "type": "string"
                },
                "thumbnail_image": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "title": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                },
                "user_id": {
                    "type": "integer"
                },
                "version": {
                    "type": "integer"
                }
            }
        },
        "store.User": {
            "type": "object",
            "properties": {
                "bio": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "is_active": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                },
                "profile_picture": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "role": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    },
    "securityDefinitions": {
        "ApiKeyAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "/v1",
	Schemes:          []string{},
	Title:            "Blog Post API",
	Description:      "API for my blog post",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
