package mailer

import "embed"

const (
	FromName            = "ritchie-blogpost"
	maxRetries          = 3
	UserWelcomeTemplate = "user_invitation.tmpl"
	Subject             = "Finish Registration with Ritchie Blogpost"
)

//go:embed "templates"
var FS embed.FS

type Client interface {
	Send(templateFile, username, email string, data any, isSandbox bool) (int, error)
}
