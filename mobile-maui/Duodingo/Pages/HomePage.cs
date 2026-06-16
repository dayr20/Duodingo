using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

public class HomePage : ContentPage
{
    private readonly Label _xp = MakeStat();
    private readonly Label _hearts = MakeStat();
    private readonly Label _streak = MakeStat();
    private readonly VerticalStackLayout _list = new() { Spacing = 14 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };
    private bool _loaded;

    public HomePage()
    {
        Title = "Apprendre";
        BackgroundColor = Theme.Polar;

        var header = new Grid
        {
            Padding = new Thickness(20, 16),
            BackgroundColor = Theme.Snow,
            ColumnDefinitions =
            {
                new ColumnDefinition(GridLength.Star),
                new ColumnDefinition(GridLength.Auto),
                new ColumnDefinition(GridLength.Auto),
            },
            ColumnSpacing = 16,
        };
        header.Add(UiKit.StatPill("🔥", _streak), 0);
        header.Add(UiKit.StatPill("⭐", _xp), 1);
        header.Add(UiKit.StatPill("❤️", _hearts), 2);

        var scroll = new ScrollView
        {
            Content = new VerticalStackLayout
            {
                Padding = 20,
                Spacing = 16,
                Children =
                {
                    new Label
                    {
                        Text = "Choisis un langage",
                        FontSize = 22,
                        FontAttributes = FontAttributes.Bold,
                        TextColor = Theme.Wolf,
                    },
                    _busy,
                    _list,
                },
            },
        };

        var root = new Grid
        {
            RowDefinitions = { new RowDefinition(GridLength.Auto), new RowDefinition(GridLength.Star) },
        };
        root.Add(header, 0, 0);
        root.Add(scroll, 0, 1);
        Content = root;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        RefreshStats();
        if (!_loaded)
            await LoadLanguagesAsync();
    }

    private void RefreshStats()
    {
        var u = App.Api.CurrentUser;
        if (u == null) return;
        _xp.Text = u.Xp.ToString();
        _hearts.Text = u.Hearts.ToString();
        _streak.Text = u.Streak.ToString();
    }

    private async Task LoadLanguagesAsync()
    {
        _busy.IsVisible = _busy.IsRunning = true;
        try
        {
            var languages = await App.Api.GetLanguagesAsync();
            _list.Children.Clear();
            foreach (var lang in languages)
                _list.Children.Add(BuildLanguageCard(lang));
            _loaded = true;
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

    private View BuildLanguageCard(Language lang)
    {
        Color color;
        try { color = Color.FromArgb(lang.Color); } catch { color = Theme.Feather; }

        var iconBox = new Border
        {
            BackgroundColor = color,
            WidthRequest = 54,
            HeightRequest = 54,
            StrokeThickness = 0,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
            Content = new Label
            {
                Text = Icons.Emoji(lang.Icon, "💻"),
                FontSize = 28,
                HorizontalOptions = LayoutOptions.Center,
                VerticalOptions = LayoutOptions.Center,
            },
        };
        var texts = new VerticalStackLayout
        {
            VerticalOptions = LayoutOptions.Center,
            Spacing = 2,
            Children =
            {
                new Label { Text = lang.Name, FontSize = 18, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf },
                new Label { Text = lang.Description, FontSize = 13, TextColor = Theme.Hare, MaxLines = 2 },
            },
        };
        var inner = new Grid
        {
            ColumnDefinitions =
            {
                new ColumnDefinition(GridLength.Auto),
                new ColumnDefinition(GridLength.Star),
            },
            ColumnSpacing = 14,
        };
        inner.Add(iconBox, 0, 0);
        inner.Add(texts, 1, 0);

        var card = new Border
        {
            BackgroundColor = Theme.Snow,
            Stroke = Theme.Swan,
            StrokeThickness = 2,
            Padding = 16,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 18 },
            Content = inner,
        };

        var tap = new TapGestureRecognizer();
        tap.Tapped += async (_, _) =>
            await Shell.Current.GoToAsync($"path?languageId={lang.Id}&name={Uri.EscapeDataString(lang.Name)}&color={Uri.EscapeDataString(lang.Color)}");
        card.GestureRecognizers.Add(tap);
        return card;
    }

    private static Label MakeStat() => new()
    {
        Text = "0",
        FontSize = 18,
        FontAttributes = FontAttributes.Bold,
        TextColor = Theme.Wolf,
        VerticalOptions = LayoutOptions.Center,
    };
}
