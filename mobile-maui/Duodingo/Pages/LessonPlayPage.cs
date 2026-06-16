using Duodingo.Models;
using Duodingo.Services;

namespace Duodingo.Pages;

[QueryProperty(nameof(LessonId), "lessonId")]
public class LessonPlayPage : ContentPage
{
    public string LessonId { get; set; } = "";

    private Lesson? _lesson;
    private int _index;
    private int _correct;
    private bool _checked;

    // Sélection (qcm / true_false / fill_code)
    private readonly List<(Border border, string text)> _options = new();
    private int _selected = -1;

    // Remise en ordre (order_code)
    private readonly List<string> _ordered = new();
    private VerticalStackLayout? _orderAnswer;
    private VerticalStackLayout? _orderPool;

    private readonly ProgressBar _progress = new() { ProgressColor = Theme.Feather, HeightRequest = 14 };
    private readonly Label _heartsLabel = new() { FontSize = 16, FontAttributes = FontAttributes.Bold, TextColor = Theme.Cardinal, VerticalOptions = LayoutOptions.Center };
    private readonly VerticalStackLayout _body = new() { Spacing = 16, Padding = 20 };
    private readonly Border _feedback;
    private readonly Label _feedbackTitle = new() { FontSize = 18, FontAttributes = FontAttributes.Bold };
    private readonly Label _feedbackText = new() { FontSize = 14 };
    private Border _actionButton = null!;
    private readonly Label _actionLabel = new() { Text = "VÉRIFIER", TextColor = Colors.White, FontAttributes = FontAttributes.Bold, FontSize = 16, HorizontalOptions = LayoutOptions.Center, VerticalOptions = LayoutOptions.Center };
    private readonly ActivityIndicator _busy = new() { Color = Theme.Feather, IsVisible = false };

    public LessonPlayPage()
    {
        NavigationPage.SetHasNavigationBar(this, false);
        Shell.SetNavBarIsVisible(this, false);
        BackgroundColor = Theme.Snow;

        // En-tête : croix + barre de progression + coeurs
        var close = new Label { Text = "✕", FontSize = 24, TextColor = Theme.Hare, VerticalOptions = LayoutOptions.Center };
        var closeTap = new TapGestureRecognizer();
        closeTap.Tapped += async (_, _) => await ExitAsync();
        close.GestureRecognizers.Add(closeTap);

        var header = new Grid
        {
            Padding = new Thickness(16, 12),
            ColumnSpacing = 14,
            ColumnDefinitions =
            {
                new ColumnDefinition(GridLength.Auto),
                new ColumnDefinition(GridLength.Star),
                new ColumnDefinition(GridLength.Auto),
            },
        };
        var hearts = UiKit.StatPill("❤️", _heartsLabel);
        header.Add(close, 0, 0);
        header.Add(new ContentView { Content = _progress, VerticalOptions = LayoutOptions.Center }, 1, 0);
        header.Add(hearts, 2, 0);

        // Bandeau de feedback
        _feedback = new Border
        {
            IsVisible = false,
            Padding = 16,
            StrokeThickness = 0,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
            Content = new VerticalStackLayout { Spacing = 4, Children = { _feedbackTitle, _feedbackText } },
        };

        _actionButton = new Border
        {
            BackgroundColor = Theme.Feather,
            StrokeThickness = 0,
            HeightRequest = 52,
            Content = _actionLabel,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
            Shadow = new Shadow { Brush = Theme.FeatherDark, Offset = new Point(0, 4), Radius = 0, Opacity = 1f },
        };
        var actionTap = new TapGestureRecognizer();
        actionTap.Tapped += async (_, _) => await OnActionAsync();
        _actionButton.GestureRecognizers.Add(actionTap);

        var footer = new VerticalStackLayout
        {
            Padding = new Thickness(20, 12, 20, 24),
            Spacing = 12,
            Children = { _feedback, _actionButton },
        };

        var root = new Grid
        {
            RowDefinitions =
            {
                new RowDefinition(GridLength.Auto),
                new RowDefinition(GridLength.Star),
                new RowDefinition(GridLength.Auto),
            },
        };
        root.Add(header, 0, 0);
        root.Add(new ScrollView { Content = _body }, 0, 1);
        root.Add(footer, 0, 2);
        root.Add(_busy, 0, 1);
        Content = root;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (_lesson != null) return;
        await LoadAsync();
    }

    private async Task LoadAsync()
    {
        _busy.IsVisible = _busy.IsRunning = true;
        try
        {
            _lesson = await App.Api.GetLessonAsync(LessonId);
            _heartsLabel.Text = (App.Api.CurrentUser?.Hearts ?? 5).ToString();
            if (_lesson.Exercises.Count == 0)
            {
                await DisplayAlert("Leçon vide", "Cette leçon ne contient pas d'exercices.", "OK");
                await ExitAsync();
                return;
            }
            ShowExercise();
        }
        catch (ApiException ex)
        {
            await DisplayAlert("Oups", ex.Message, "OK");
            await ExitAsync();
        }
        finally
        {
            _busy.IsVisible = _busy.IsRunning = false;
        }
    }

    private Exercise Current => _lesson!.Exercises[_index];

    private void ShowExercise()
    {
        _checked = false;
        _selected = -1;
        _options.Clear();
        _ordered.Clear();
        _orderAnswer = _orderPool = null;
        _feedback.IsVisible = false;
        _actionLabel.Text = "VÉRIFIER";
        SetActionEnabled(false);
        _progress.Progress = (double)_index / _lesson!.Exercises.Count;

        _body.Children.Clear();
        var ex = Current;

        _body.Children.Add(new Label
        {
            Text = ex.Question,
            FontSize = 20,
            FontAttributes = FontAttributes.Bold,
            TextColor = Theme.Wolf,
        });

        if (!string.IsNullOrWhiteSpace(ex.CodeSnippet))
            _body.Children.Add(UiKit.CodeBlock(ex.CodeSnippet!));

        if (ex.Type == "order_code")
            BuildOrderUi(ex);
        else
            BuildChoiceUi(ex);
    }

    private void BuildChoiceUi(Exercise ex)
    {
        for (int i = 0; i < ex.Options.Count; i++)
        {
            var opt = ex.Options[i];
            int idx = i;
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
            tap.Tapped += (_, _) => SelectOption(idx);
            border.GestureRecognizers.Add(tap);
            _options.Add((border, opt.Text));
            _body.Children.Add(border);
        }
    }

    private void SelectOption(int idx)
    {
        if (_checked) return;
        _selected = idx;
        for (int i = 0; i < _options.Count; i++)
        {
            var b = _options[i].border;
            bool sel = i == idx;
            b.Stroke = sel ? Theme.Macaw : Theme.Swan;
            b.BackgroundColor = sel ? Color.FromArgb("#DDF4FF") : Theme.Snow;
        }
        SetActionEnabled(true);
    }

    private void BuildOrderUi(Exercise ex)
    {
        _orderAnswer = new VerticalStackLayout { Spacing = 8, MinimumHeightRequest = 40 };
        _orderPool = new VerticalStackLayout { Spacing = 8 };

        _body.Children.Add(new Label { Text = "Ta réponse :", FontSize = 13, TextColor = Theme.Hare });
        _body.Children.Add(new Border
        {
            BackgroundColor = Theme.Polar,
            StrokeThickness = 0,
            Padding = 8,
            MinimumHeightRequest = 50,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 12 },
            Content = _orderAnswer,
        });
        _body.Children.Add(new Label { Text = "Lignes disponibles :", FontSize = 13, TextColor = Theme.Hare, Margin = new Thickness(0, 8, 0, 0) });
        _body.Children.Add(_orderPool);

        // Mélange les lignes pour la remise en ordre.
        var lines = ex.Options.Select(o => o.Text).OrderBy(_ => Guid.NewGuid()).ToList();
        foreach (var line in lines)
            _orderPool.Children.Add(OrderChip(line, inPool: true));
    }

    private View OrderChip(string text, bool inPool)
    {
        var border = new Border
        {
            BackgroundColor = inPool ? Theme.Snow : Color.FromArgb("#DDF4FF"),
            Stroke = inPool ? Theme.Swan : Theme.Macaw,
            StrokeThickness = 2,
            Padding = new Thickness(14, 12),
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 12 },
            Content = new Label { Text = text, FontFamily = "Consolas", FontSize = 14, TextColor = Theme.Wolf },
        };
        var tap = new TapGestureRecognizer();
        tap.Tapped += (_, _) =>
        {
            if (_checked) return;
            if (inPool)
            {
                _orderPool!.Children.Remove(border);
                _ordered.Add(text);
                _orderAnswer!.Children.Add(OrderChip(text, inPool: false));
            }
            else
            {
                _orderAnswer!.Children.Remove(border);
                _ordered.Remove(text);
                _orderPool!.Children.Add(OrderChip(text, inPool: true));
            }
            SetActionEnabled(_ordered.Count > 0);
        };
        border.GestureRecognizers.Add(tap);
        return border;
    }

    private async Task OnActionAsync()
    {
        if (!_actionButton.IsEnabled) return;

        if (!_checked)
        {
            await CheckAnswerAsync();
            return;
        }

        // Passe à l'exercice suivant (ou termine).
        _index++;
        if (_index >= _lesson!.Exercises.Count)
            await FinishAsync();
        else
            ShowExercise();
    }

    private async Task CheckAnswerAsync()
    {
        var ex = Current;
        bool correct;
        if (ex.Type == "order_code")
            correct = _ordered.SequenceEqual(ex.CorrectAnswerList);
        else
            correct = _selected >= 0 && _options[_selected].text == ex.CorrectAnswerText;

        _checked = true;
        if (correct) _correct++;

        // Marque visuellement la bonne / mauvaise réponse pour les QCM.
        if (ex.Type != "order_code" && _selected >= 0)
        {
            var sel = _options[_selected].border;
            sel.Stroke = correct ? Theme.Feather : Theme.Cardinal;
            sel.BackgroundColor = correct ? Color.FromArgb("#D7FFB8") : Color.FromArgb("#FFDFE0");
        }

        ShowFeedback(correct, ex.Explanation);

        if (!correct)
            await LoseHeartAsync();
    }

    private void ShowFeedback(bool correct, string explanation)
    {
        _feedback.BackgroundColor = correct ? Color.FromArgb("#D7FFB8") : Color.FromArgb("#FFDFE0");
        _feedbackTitle.TextColor = correct ? Theme.FeatherDark : Theme.CardinalDark;
        _feedbackText.TextColor = correct ? Theme.FeatherDark : Theme.CardinalDark;
        _feedbackTitle.Text = correct ? "Bravo ! 🎉" : "Pas tout à fait…";
        _feedbackText.Text = explanation;
        _feedbackText.IsVisible = !string.IsNullOrWhiteSpace(explanation);
        _feedback.IsVisible = true;

        _actionLabel.Text = _index + 1 >= _lesson!.Exercises.Count ? "TERMINER" : "CONTINUER";
        _actionButton.BackgroundColor = correct ? Theme.Feather : Theme.Cardinal;
        _actionButton.Shadow = new Shadow { Brush = correct ? Theme.FeatherDark : Theme.CardinalDark, Offset = new Point(0, 4), Radius = 0, Opacity = 1f };
        SetActionEnabled(true);
    }

    private async Task LoseHeartAsync()
    {
        try
        {
            var res = await App.Api.UpdateHeartsAsync("lose");
            _heartsLabel.Text = res.Hearts.ToString();
            if (App.Api.CurrentUser != null) App.Api.CurrentUser.Hearts = res.Hearts;
            if (res.Hearts <= 0)
            {
                await DisplayAlert("Plus de cœurs 💔", "Tu n'as plus de cœurs. Réessaie cette leçon plus tard.", "OK");
                await ExitAsync();
            }
        }
        catch { /* on n'interrompt pas la leçon pour une erreur de coeurs */ }
    }

    private async Task FinishAsync()
    {
        _progress.Progress = 1;
        SetActionEnabled(false);
        var total = _lesson!.Exercises.Count;
        var score = (int)Math.Round((double)_correct / total * 100);
        try
        {
            var res = await App.Api.CompleteLessonAsync(LessonId, score, _correct, total);
            if (App.Api.CurrentUser != null)
            {
                App.Api.CurrentUser.Xp = res.TotalXp;
                App.Api.CurrentUser.Level = res.Level;
                App.Api.CurrentUser.Streak = res.Streak;
            }
            await Shell.Current.GoToAsync(
                $"result?xp={res.XpEarned}&correct={_correct}&total={total}&streak={res.Streak}&level={res.Level}");
        }
        catch (ApiException ex)
        {
            await DisplayAlert("Oups", ex.Message, "OK");
            await ExitAsync();
        }
    }

    private void SetActionEnabled(bool enabled)
    {
        _actionButton.IsEnabled = enabled;
        _actionButton.Opacity = enabled ? 1 : 0.4;
    }

    private async Task ExitAsync() => await Shell.Current.GoToAsync("//home");
}
