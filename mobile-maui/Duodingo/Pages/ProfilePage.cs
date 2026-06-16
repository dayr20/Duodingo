using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

public class ProfilePage : ContentPage
{
    private readonly Label _name = new() { FontSize = 24, FontAttributes = FontAttributes.Bold, TextColor = Colors.White, HorizontalOptions = LayoutOptions.Center };
    private readonly Label _email = new() { FontSize = 14, TextColor = Colors.White, Opacity = 0.9, HorizontalOptions = LayoutOptions.Center };
    private readonly Grid _statsGrid = new()
    {
        ColumnDefinitions = { new(GridLength.Star), new(GridLength.Star) },
        RowDefinitions = { new(GridLength.Auto), new(GridLength.Auto) },
        ColumnSpacing = 12,
        RowSpacing = 12,
    };
    private readonly VerticalStackLayout _achievements = new() { Spacing = 10 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };

    public ProfilePage()
    {
        Title = "Profil";
        BackgroundColor = Theme.Polar;

        var avatar = new Border
        {
            BackgroundColor = Color.FromArgb("#4FB802"),
            WidthRequest = 84,
            HeightRequest = 84,
            StrokeThickness = 0,
            HorizontalOptions = LayoutOptions.Center,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 42 },
            Content = new Label { Text = "🦉", FontSize = 44, HorizontalOptions = LayoutOptions.Center, VerticalOptions = LayoutOptions.Center },
        };

        var headerCard = new Border
        {
            BackgroundColor = Theme.Feather,
            StrokeThickness = 0,
            Padding = new Thickness(20, 28),
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 22 },
            Content = new VerticalStackLayout { Spacing = 8, Children = { avatar, _name, _email } },
        };

        var logout = UiKit.BigButton("Se déconnecter", Theme.Cardinal, Theme.CardinalDark, async (_, _) => await LogoutAsync());

        Content = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = 20,
                Spacing = 20,
                Children =
                {
                    _busy,
                    headerCard,
                    _statsGrid,
                    new Label { Text = "Succès", FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf },
                    _achievements,
                    new BoxView { HeightRequest = 10, Color = Colors.Transparent },
                    logout,
                },
            },
        };
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await LoadAsync();
    }

    private async Task LoadAsync()
    {
        _busy.IsVisible = _busy.IsRunning = true;
        try
        {
            var u = App.Api.CurrentUser;
            _name.Text = u?.Username ?? "";
            _email.Text = u?.Email ?? "";

            var stats = await App.Api.GetStatsAsync();
            _statsGrid.Children.Clear();
            _statsGrid.Add(StatBox("⭐", stats.Xp.ToString(), "XP total", Theme.Bee), 0, 0);
            _statsGrid.Add(StatBox("🏆", $"Niv. {stats.Level}", "Niveau", Theme.Macaw), 1, 0);
            _statsGrid.Add(StatBox("🔥", stats.Streak.ToString(), "Série", Theme.Fox), 0, 1);
            _statsGrid.Add(StatBox("📚", stats.TotalLessonsCompleted.ToString(), "Leçons", Theme.Feather), 1, 1);

            _achievements.Children.Clear();
            if (stats.Achievements.Count == 0)
                _achievements.Children.Add(new Label { Text = "Aucun succès pour le moment. Continue à apprendre ! 💪", FontSize = 14, TextColor = Theme.Hare });
            foreach (var a in stats.Achievements)
                _achievements.Children.Add(AchievementRow(a));
        }
        catch (ApiException ex)
        {
            await DisplayAlert("Oups", ex.Message, "OK");
        }
        finally
        {
            _busy.IsVisible = _busy.IsRunning = false;
        }
    }

    private static View StatBox(string emoji, string value, string label, Color color) => new Border
    {
        BackgroundColor = Theme.Snow,
        Stroke = Theme.Swan,
        StrokeThickness = 2,
        Padding = 16,
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
        Content = new VerticalStackLayout
        {
            Spacing = 2,
            Children =
            {
                new Label { Text = emoji, FontSize = 26 },
                new Label { Text = value, FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = color },
                new Label { Text = label, FontSize = 12, TextColor = Theme.Hare },
            },
        },
    };

    private static View AchievementRow(Achievement a) => new Border
    {
        BackgroundColor = Theme.Snow,
        Stroke = Theme.Swan,
        StrokeThickness = 2,
        Padding = new Thickness(14, 12),
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
        Content = new HorizontalStackLayout
        {
            Spacing = 12,
            Children =
            {
                new Label { Text = a.Icon, FontSize = 26, VerticalOptions = LayoutOptions.Center },
                new Label { Text = a.Name, FontSize = 16, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf, VerticalOptions = LayoutOptions.Center },
            },
        },
    };

    private async Task LogoutAsync()
    {
        bool ok = await DisplayAlert("Déconnexion", "Veux-tu vraiment te déconnecter ?", "Oui", "Annuler");
        if (!ok) return;
        App.Api.Logout();
        App.ShowLogin();
    }
}
