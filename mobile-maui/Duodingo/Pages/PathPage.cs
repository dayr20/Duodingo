using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

[QueryProperty(nameof(LanguageId), "languageId")]
[QueryProperty(nameof(LanguageName), "name")]
[QueryProperty(nameof(LanguageColor), "color")]
public class PathPage : ContentPage
{
    public string LanguageId { get; set; } = "";
    public string LanguageName { set => Title = Uri.UnescapeDataString(value ?? ""); }
    public string LanguageColor { get; set; } = "#58CC02";

    private readonly VerticalStackLayout _content = new() { Spacing = 24, Padding = 20 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };
    private bool _loaded;

    public PathPage()
    {
        BackgroundColor = Theme.Polar;
        Content = new ScrollView
        {
            Content = new VerticalStackLayout { Children = { _busy, _content } },
        };
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (_loaded) return;
        await LoadAsync();
    }

    private Color AccentColor
    {
        get { try { return Color.FromArgb(Uri.UnescapeDataString(LanguageColor)); } catch { return Theme.Feather; } }
    }

    private async Task LoadAsync()
    {
        _busy.IsVisible = _busy.IsRunning = true;
        try
        {
            var topics = await App.Api.GetTopicsAsync(LanguageId);
            _content.Children.Clear();
            foreach (var topic in topics)
            {
                _content.Children.Add(BuildTopicHeader(topic));
                var lessons = await App.Api.GetLessonsAsync(LanguageId, topic.Id);
                int i = 0;
                foreach (var lesson in lessons)
                    _content.Children.Add(BuildLessonNode(lesson, i++));
            }
            if (topics.Count == 0)
                _content.Children.Add(new Label
                {
                    Text = "Aucun chapitre disponible pour ce langage.",
                    TextColor = Theme.Hare,
                    HorizontalOptions = LayoutOptions.Center,
                });
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

    private View BuildTopicHeader(Topic topic) => new Border
    {
        BackgroundColor = AccentColor,
        StrokeThickness = 0,
        Padding = new Thickness(16, 12),
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
        Content = new VerticalStackLayout
        {
            Spacing = 2,
            Children =
            {
                new Label { Text = $"{Icons.Emoji(topic.Icon)}  {topic.Name}", FontSize = 18, FontAttributes = FontAttributes.Bold, TextColor = Colors.White },
                new Label { Text = topic.Description, FontSize = 13, TextColor = Colors.White, Opacity = 0.9, IsVisible = !string.IsNullOrWhiteSpace(topic.Description) },
            },
        },
    };

    private View BuildLessonNode(LessonSummary lesson, int index)
    {
        // Décalage en zig-zag pour évoquer le chemin sinueux de Duolingo.
        var offset = (index % 2 == 0) ? -40 : 40;

        var circle = new Border
        {
            BackgroundColor = AccentColor,
            WidthRequest = 72,
            HeightRequest = 72,
            StrokeThickness = 0,
            HorizontalOptions = LayoutOptions.Center,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 36 },
            Shadow = new Shadow { Brush = AccentColor, Offset = new Point(0, 4), Radius = 0, Opacity = 0.5f },
            Content = new Label
            {
                Text = "⭐",
                FontSize = 30,
                HorizontalOptions = LayoutOptions.Center,
                VerticalOptions = LayoutOptions.Center,
            },
        };

        var stack = new VerticalStackLayout
        {
            Spacing = 6,
            HorizontalOptions = LayoutOptions.Center,
            TranslationX = offset,
            Children =
            {
                circle,
                new Label
                {
                    Text = lesson.Title,
                    FontSize = 13,
                    FontAttributes = FontAttributes.Bold,
                    TextColor = Theme.Wolf,
                    HorizontalTextAlignment = TextAlignment.Center,
                    MaxLines = 2,
                    WidthRequest = 140,
                },
            },
        };

        var tap = new TapGestureRecognizer();
        tap.Tapped += async (_, _) =>
            await Shell.Current.GoToAsync($"lesson?lessonId={lesson.Id}");
        stack.GestureRecognizers.Add(tap);
        return stack;
    }
}
