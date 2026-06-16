using Duodingo.Services;

namespace Duodingo.Pages;

public class LoginPage : ContentPage
{
    private readonly Entry _email = new() { Keyboard = Keyboard.Email, Placeholder = "Email", ReturnType = ReturnType.Next };
    private readonly Entry _password = new() { IsPassword = true, Placeholder = "Mot de passe", ReturnType = ReturnType.Done };
    private readonly Label _error = new() { TextColor = Theme.Cardinal, IsVisible = false, FontSize = 14 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };
    private Border _button = null!;

    public LoginPage()
    {
        NavigationPage.SetHasNavigationBar(this, false);
        BackgroundColor = Theme.Snow;
        Title = "Connexion";

        _button = UiKit.PrimaryButton("Se connecter", async (_, _) => await DoLoginAsync());

        var register = new Label
        {
            Text = "Pas de compte ? Créer un compte",
            TextColor = Theme.Macaw,
            FontAttributes = FontAttributes.Bold,
            HorizontalOptions = LayoutOptions.Center,
        };
        var tap = new TapGestureRecognizer();
        tap.Tapped += async (_, _) => await Navigation.PushAsync(new RegisterPage());
        register.GestureRecognizers.Add(tap);

        Content = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = new Thickness(24, 60),
                Spacing = 18,
                Children =
                {
                    new Label { Text = "🦉", FontSize = 64, HorizontalOptions = LayoutOptions.Center },
                    new Label
                    {
                        Text = "Duodingo",
                        FontSize = 34,
                        FontAttributes = FontAttributes.Bold,
                        TextColor = Theme.Feather,
                        HorizontalOptions = LayoutOptions.Center,
                    },
                    new Label
                    {
                        Text = "Apprends à coder, une leçon à la fois.",
                        FontSize = 15,
                        TextColor = Theme.Hare,
                        HorizontalOptions = LayoutOptions.Center,
                        Margin = new Thickness(0, 0, 0, 20),
                    },
                    UiKit.TextField(_email),
                    UiKit.TextField(_password),
                    _error,
                    _button,
                    _busy,
                    register,
                },
            },
        };
    }

    private async Task DoLoginAsync()
    {
        _error.IsVisible = false;
        if (string.IsNullOrWhiteSpace(_email.Text) || string.IsNullOrWhiteSpace(_password.Text))
        {
            ShowError("Renseigne ton email et ton mot de passe.");
            return;
        }

        SetBusy(true);
        try
        {
            await App.Api.LoginAsync(_email.Text.Trim(), _password.Text);
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
