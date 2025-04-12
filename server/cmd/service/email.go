package service

import (
	"fmt"

	"github.com/ritchie-gr8/my-blog-app/internal/mailer"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type EmailService struct {
	mailer      mailer.Client
	env         string
	frontendURL string
}

func (s *EmailService) GenerateActivationURL(token string) string {
	return fmt.Sprintf("%s/confirm/%s", s.frontendURL, token)
}

func (s *EmailService) SendWelcomeEmail(user *store.User, activationURL string) (int, error) {
	isProdEnv := s.env == "production"

	data := struct {
		Username      string
		ActivationURL string
	}{
		Username:      user.Username,
		ActivationURL: activationURL,
	}

	return s.mailer.Send(
		mailer.UserWelcomeTemplate,
		user.Username,
		user.Email,
		data,
		!isProdEnv,
	)
}
