using Duodingo.Services;

namespace Duodingo.Pages;

public class RegisterPage : ContentPage
{
    private readonly Entry _username = new() { Placeholder = "Nom d'utilisateur", ReturnType = ReturnType.Next };
    private readonly Entry _email = new() { Keyboard = Keyboard.Email, Placeholder = "Email", ReturnType = ReturnType.Next };
    private readonly Entry _password = new() { IsPassword = true, Placeholder = "Mot de passe", ReturnType = ReturnType.Done };
    private readonly Label _error = new() { TextColor = Theme.Cardinal, IsVisible = false, FontSize = 14 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };
    private Border _button = null!;

    public RegisterPage()
    {
        BackgroundColor = Theme.Snow;
        Title = "Créer un compte";

        _button = UiKit.PrimaryButton("Créer mon compte", async (_, _) => await DoRegisterAsync());

        Content = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = new Thickness(24, 40),
                Spacing = 18,
                Children =
                {
                    new Label { Text = "🦉", FontSize = 56, HorizontalOptions = LayoutOptions.Center },
                    new Label
                    {
                        Text = "Rejoins Duodingo",
                        FontSize = 26,
                        FontAttributes = FontAttributes.Bold,
                        TextColor = Theme.Feather,
                        HorizontalOptions = LayoutOptions.Center,
                        Margin = new Thickness(0, 0, 0, 16),
                    },
                    UiKit.TextField(_username),
                    UiKit.TextField(_email),
                    UiKit.TextField(_password),
                    _error,
                    _button,
                    _busy,
                },
            },
        };
    }

    private async Task DoRegisterAsync()
    {
        _error.IsVisible = false;
        if (string.IsNullOrWhiteSpace(_username.Text) ||
            string.IsNullOrWhiteSpace(_email.Text) ||
            string.IsNullOrWhiteSpace(_password.Text))
        {
            ShowError("Tous les champs sont obligatoires.");
            return;
        }
        if (_password.Text.Length < 6)
        {
            ShowError("Le mot de passe doit faire au moins 6 caractères.");
            return;
        }

        SetBusy(true);
        try
        {
            await App.Api.RegisterAsync(_username.Text.Trim(), _email.Text.Trim(), _password.Text);
            App.ShowMain();
        }
        catch (ApiException ex)
        {
            ShowError(ex.Message);
        }
        finally
        {
            SetBusy(false);
        }
    }

    private void ShowError(string msg)
    {
        _error.Text = msg;
        _error.IsVisible = true;
    }

    private void SetBusy(bool busy)
    {
        _busy.IsVisible = busy;
        _busy.IsRunning = busy;
        _button.IsEnabled = !busy;
        _button.Opacity = busy ? 0.6 : 1;
    }
}
