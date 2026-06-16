using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

public class LeaderboardPage : ContentPage
{
    private readonly VerticalStackLayout _list = new() { Spacing = 10, Padding = 20 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };

    public LeaderboardPage()
    {
        Title = "Classement";
        BackgroundColor = Theme.Polar;
        Content = new ScrollView { Content = new VerticalStackLayout { Children = { _busy, _list } } };
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
            var entries = await App.Api.GetLeaderboardAsync();
            _list.Children.Clear();
            _list.Children.Add(new Label
            {
                Text = "🏆 Classement XP",
                FontSize = 22,
                FontAttributes = FontAttributes.Bold,
                TextColor = Theme.Wolf,
                Margin = new Thickness(0, 0, 0, 6),
            });
            foreach (var e in entries)
                _list.Children.Add(BuildRow(e));
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

    private View BuildRow(LeaderboardEntry e)
    {
        var medal = e.Rank switch { 1 => "🥇", 2 => "🥈", 3 => "🥉", _ => $"{e.Rank}" };

        var grid = new Grid
        {
            ColumnSpacing = 12,
            ColumnDefinitions =
            {
                new ColumnDefinition(new GridLength(36)),
                new ColumnDefinition(GridLength.Star),
                new ColumnDefinition(GridLength.Auto),
            },
        };
        grid.Add(new Label { Text = medal, FontSize = 18, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf, VerticalOptions = LayoutOptions.Center, HorizontalTextAlignment = TextAlignment.Center }, 0, 0);
        grid.Add(new VerticalStackLayout
        {
            VerticalOptions = LayoutOptions.Center,
            Children =
            {
                new Label { Text = e.Username + (e.IsMe ? "  (toi)" : ""), FontSize = 16, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf },
                new Label { Text = $"Niveau {e.Level} · 🔥 {e.Streak}", FontSize = 12, TextColor = Theme.Hare },
            },
        }, 1, 0);
        grid.Add(new Label { Text = $"⭐ {e.Xp}", FontSize = 15, FontAttributes = FontAttributes.Bold, TextColor = Theme.Fox, VerticalOptions = LayoutOptions.Center }, 2, 0);

        return new Border
        {
            BackgroundColor = e.IsMe ? Color.FromArgb("#DDF4FF") : Theme.Snow,
            Stroke = e.IsMe ? Theme.Macaw : Theme.Swan,
            StrokeThickness = 2,
            Padding = new Thickness(14, 12),
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
            Content = grid,
        };
    }
}
