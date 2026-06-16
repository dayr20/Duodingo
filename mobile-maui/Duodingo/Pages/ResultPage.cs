namespace Duodingo.Pages;

[QueryProperty(nameof(Xp), "xp")]
[QueryProperty(nameof(Correct), "correct")]
[QueryProperty(nameof(Total), "total")]
[QueryProperty(nameof(Streak), "streak")]
[QueryProperty(nameof(Level), "level")]
public class ResultPage : ContentPage
{
    public string Xp { get; set; } = "0";
    public string Correct { get; set; } = "0";
    public string Total { get; set; } = "0";
    public string Streak { get; set; } = "0";
    public string Level { get; set; } = "1";

    public ResultPage()
    {
        NavigationPage.SetHasNavigationBar(this, false);
        Shell.SetNavBarIsVisible(this, false);
        BackgroundColor = Theme.Feather;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        Build();
    }

    private void Build()
    {
        int.TryParse(Correct, out var correct);
        int.TryParse(Total, out var total);
        var accuracy = total > 0 ? (int)Math.Round((double)correct / total * 100) : 0;

        var button = UiKit.BigButton("Continuer", Colors.White, Color.FromArgb("#E0E0E0"),
            async (_, _) => await Shell.Current.GoToAsync("//home"));
        // Texte du bouton en vert sur fond blanc.
        if (button.Content is Label l) l.TextColor = Theme.Feather;

        Content = new VerticalStackLayout
        {
            Padding = new Thickness(28, 80),
            Spacing = 18,
            VerticalOptions = LayoutOptions.Center,
            Children =
            {
                new Label { Text = "🎉", FontSize = 80, HorizontalOptions = LayoutOptions.Center },
                new Label
                {
                    Text = "Leçon terminée !",
                    FontSize = 30,
                    FontAttributes = FontAttributes.Bold,
                    TextColor = Colors.White,
                    HorizontalOptions = LayoutOptions.Center,
                },
                StatCard("⭐", $"+{Xp} XP", "Expérience gagnée"),
                StatCard("🎯", $"{accuracy}%", $"{correct}/{total} bonnes réponses"),
                StatCard("🔥", Streak, "Jours de série"),
                new BoxView { HeightRequest = 20, Color = Colors.Transparent },
                button,
            },
        };
    }

    private static View StatCard(string emoji, string value, string label) => new Border
    {
        BackgroundColor = Color.FromArgb("#4FB802"),
        StrokeThickness = 0,
        Padding = 16,
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
        Content = new HorizontalStackLayout
        {
            Spacing = 14,
            Children =
            {
                new Label { Text = emoji, FontSize = 30, VerticalOptions = LayoutOptions.Center },
                new VerticalStackLayout
                {
                    VerticalOptions = LayoutOptions.Center,
                    Children =
                    {
                        new Label { Text = value, FontSize = 22, FontAttributes = FontAttributes.Bold, TextColor = Colors.White },
                        new Label { Text = label, FontSize = 13, TextColor = Colors.White, Opacity = 0.9 },
                    },
                },
            },
        },
    };
}
