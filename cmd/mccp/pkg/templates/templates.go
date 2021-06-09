package templates

import (
	"fmt"
	"io"
)

type TemplatesRetriever interface {
	Source() string
	RetrieveTemplates() ([]Template, error)
}

type TemplateParametersRetriever interface {
	Source() string
	RetrieveTemplateParameters(name string) ([]TemplateParameter, error)
}

type TemplateRenderer interface {
	RenderTemplateWithParameters(name string, parameters map[string]string) (string, error)
}

type Template struct {
	Name        string
	Description string
}

type TemplateParameter struct {
	Name        string
	Description string
}

func ListTemplates(r TemplatesRetriever, w io.Writer) error {
	ts, err := r.RetrieveTemplates()
	if err != nil {
		return fmt.Errorf("unable to retrieve templates from %q: %w", r.Source(), err)
	}

	if len(ts) > 0 {
		fmt.Fprintf(w, "NAME\tDESCRIPTION\n")
		for _, t := range ts {
			fmt.Fprintf(w, "%s", t.Name)
			if t.Description != "" {
				fmt.Fprintf(w, "\t%s", t.Description)
			}
			fmt.Fprintln(w, "")
		}

		return nil
	}

	fmt.Fprintf(w, "No templates found.")

	return nil
}

func ListTemplateParameters(name string, r TemplateParametersRetriever, w io.Writer) error {
	ts, err := r.RetrieveTemplateParameters(name)
	if err != nil {
		return fmt.Errorf("unable to retrieve template parameters from %q: %w", r.Source(), err)
	}

	if len(ts) > 0 {
		fmt.Fprintf(w, "NAME\tDESCRIPTION\n")

		for _, t := range ts {
			fmt.Fprintf(w, "%s", t.Name)
			if t.Description != "" {
				fmt.Fprintf(w, "\t%s", t.Description)
			}
			fmt.Fprintln(w, "")
		}

		return nil
	}

	fmt.Fprintf(w, "No template parameters found.")

	return nil
}

func RenderTemplate(name string, parameters map[string]string, r TemplateRenderer, w io.Writer) error {
	s, err := r.RenderTemplateWithParameters(name, parameters)
	if err != nil {
		return fmt.Errorf("unable to render template: %w", err)
	}

	if s != "" {
		fmt.Fprint(w, s)
		return nil
	}

	fmt.Fprintf(w, "No template found.")

	return nil
}
