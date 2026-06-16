using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

public class DailyChallengePage : ContentPage
{
    private readonly VerticalStackLayout _body = new() { Spacing = 16, Padding = 20 };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };

    private Challenge? _challenge;
    private readonly List<(Border border, string text)> _options = new();
    private int _selected = -1;
    private bool _answered;
    private Border? _checkButton;
    private Label? _checkLabel;

    public DailyChallengePage()
    {
        Title = "Défi du jour";
        BackgroundColor = Theme.Polar;
        Content = new ScrollView { Content = new VerticalStackLayout { Children = { _busy, _body } } };
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await LoadAsync();
    }

    private async Task LoadAsync()
    {
        _busy.IsVisible = _busy.IsRunning = true;
        _body.Children.Clear();
        _options.Clear();
        _selected = -1;
        _answered = false;
        try
        {
            _challenge = await App.Api.GetTodayChallengeAsync();
            Build();
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

    private void Build()
    {
        var c = _challenge!;

        _body.Children.Add(new Border
        {
            BackgroundColor = Theme.Fox,
            StrokeThickness = 0,
            Padding = 16,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 18 },
            Content = new VerticalStackLayout
            {
                Spacing = 4,
                Children =
                {
                    new Label { Text = $"⚡ Défi du jour · +{c.XpReward} XP", FontSize = 14, FontAttributes = FontAttributes.Bold, TextColor = Colors.White },
                    new Label { Text = c.Title, FontSize = 20, FontAttributes = FontAttributes.Bold, TextColor = Colors.White },
                    new Label { Text = c.Description, FontSize = 13, TextColor = Colors.White, Opacity = 0.95 },
                },
            },
        });

        if (c.Completed)
        {
            _body.Children.Add(new Border
            {
                BackgroundColor = Color.FromArgb("#D7FFB8"),
                StrokeThickness = 0,
                Padding = 20,
                StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
                Content = new VerticalStackLayout
                {
                    Spacing = 6,
                    Children =
                    {
                        new Label { Text = "✅ Défi déjà relevé aujourd'hui !", FontSize = 18, FontAttributes = FontAttributes.Bold, TextColor = Theme.FeatherDark, HorizontalOptions = LayoutOptions.Center },
                        new Label { Text = "Reviens demain pour un nouveau défi.", FontSize = 14, TextColor = Theme.FeatherDark, HorizontalOptions = LayoutOptions.Center },
                    },
                },
            });
            return;
        }

        _body.Children.Add(new Label { Text = c.Question, FontSize = 18, FontAttributes = FontAttributes.Bold, TextColor = Theme.Wolf });
        if (!string.IsNullOrWhiteSpace(c.CodeSnippet))
            _body.Children.Add(UiKit.CodeBlock(c.CodeSnippet!));

        for (int i = 0; i < c.Options.Count; i++)
        {
            int idx = i;
            var opt = c.Options[i];
            var border = new Border
            {
                BackgroundColor = Theme.Snow,
                Stroke = Theme.Swan,
                StrokeThickness = 2,
                Padding = new Thickness(16, 14),
                StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
                Content = new Label { Text = opt.Text, FontSize = 16, TextColor = Theme.Wolf },
            };
            var tap = new TapGestureRecognizer();
            tap.Tapped += (_, _) => Select(idx);
            border.GestureRecognizers.Add(tap);
            _options.Add((border, opt.Text));
            _body.Children.Add(border);
        }

        _checkLabel = new Label { Text = "VALIDER", TextColor = Colors.White, FontAttributes = FontAttributes.Bold, FontSize = 16, HorizontalOptions = LayoutOptions.Center, VerticalOptions = LayoutOptions.Center };
        _checkButton = new Border
        {
            BackgroundColor = Theme.Feather,
            StrokeThickness = 0,
            HeightRequest = 52,
            Opacity = 0.4,
            IsEnabled = false,
            Content = _checkLabel,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
            Shadow = new Shadow { Brush = Theme.FeatherDark, Offset = new Point(0, 4), Radius = 0, Opacity = 1f },
            Margin = new Thickness(0, 10, 0, 0),
        };
        var checkTap = new TapGestureRecognizer();
        checkTap.Tapped += async (_, _) => await SubmitAsync();
        _checkButton.GestureRecognizers.Add(checkTap);
        _body.Children.Add(_checkButton);
    }

    private void Select(int idx)
    {
        if (_answered) return;
        _selected = idx;
        for (int i = 0; i < _options.Count; i++)
        {
            var b = _options[i].border;
            bool sel = i == idx;
            b.Stroke = sel ? Theme.Macaw : Theme.Swan;
            b.BackgroundColor = sel ? Color.FromArgb("#DDF4FF") : Theme.Snow;
        }
        if (_checkButton != null) { _checkButton.IsEnabled = true; _checkButton.Opacity = 1; }
    }

    private async Task SubmitAsync()
    {
        if (_answered || _selected < 0 || _checkButton is not { IsEnabled: true }) return;
        _answered = true;
        _checkButton.IsEnabled = false;
        _checkButton.Opacity = 0.6;

        try
        {
            var answer = _options[_selected].text;
            var res = await App.Api.CompleteChallengeAsync(answer);

            var sel = _options[_selected].border;
            sel.Stroke = res.Correct ? Theme.Feather : Theme.Cardinal;
            sel.BackgroundColor = res.Correct ? Color.FromArgb("#D7FFB8") : Color.FromArgb("#FFDFE0");

            if (res.Correct && App.Api.CurrentUser != null)
            {
                App.Api.CurrentUser.Xp = res.TotalXp;
                App.Api.CurrentUser.Level = res.Level;
            }

            _body.Children.Add(new Border
            {
                BackgroundColor = res.Correct ? Color.FromArgb("#D7FFB8") : Color.FromArgb("#FFDFE0"),
                StrokeThickness = 0,
                Padding = 16,
                Margin = new Thickness(0, 10, 0, 0),
                StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
                Content = new VerticalStackLayout
                {
                    Spacing = 4,
                    Children =
                    {
                        new Label
                        {
                            Text = res.Correct ? $"Bravo ! +{res.XpEarned} XP 🎉" : "Raté ! La bonne réponse n'était pas celle-ci.",
                            FontSize = 17,
                            FontAttributes = FontAttributes.Bold,
                            TextColor = res.Correct ? Theme.FeatherDark : Theme.CardinalDark,
                        },
                        new Label { Text = res.Explanation, FontSize = 14, TextColor = res.Correct ? Theme.FeatherDark : Theme.CardinalDark },
                    },
                },
            });
        }
        catch (ApiException ex)
        {
            await DisplayAlert("Oups", ex.Message, "OK");
            _answered = false;
            _checkButton.IsEnabled = true;
            _checkButton.Opacity = 1;
        }
    }
}
