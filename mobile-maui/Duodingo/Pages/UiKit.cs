namespace Duodingo.Pages;

/// <summary>Palette et fabriques d'UI au style Duolingo, partagées par les pages.</summary>
public static class Theme
{
    public static readonly Color Feather = Color.FromArgb("#58CC02");
    public static readonly Color FeatherDark = Color.FromArgb("#58A700");
    public static readonly Color Macaw = Color.FromArgb("#1CB0F6");
    public static readonly Color MacawDark = Color.FromArgb("#1899D6");
    public static readonly Color Cardinal = Color.FromArgb("#FF4B4B");
    public static readonly Color CardinalDark = Color.FromArgb("#EA2B2B");
    public static readonly Color Bee = Color.FromArgb("#FFC800");
    public static readonly Color Fox = Color.FromArgb("#FF9600");
    public static readonly Color Wolf = Color.FromArgb("#4B4B4B");
    public static readonly Color Hare = Color.FromArgb("#AFAFAF");
    public static readonly Color Swan = Color.FromArgb("#E5E5E5");
    public static readonly Color Polar = Color.FromArgb("#F7F7F7");
    public static readonly Color Snow = Colors.White;
}

/// <summary>Convertit les noms d'icônes Ionicons (stockés en base) en emojis affichables.</summary>
public static class Icons
{
    private static readonly Dictionary<string, string> Map = new()
    {
        ["logo-javascript"] = "🟨",
        ["logo-python"] = "🐍",
        ["code-slash"] = "🌐",
        ["code-working-outline"] = "🔷",
        ["server-outline"] = "🗄️",
        ["color-palette-outline"] = "🎨",
        ["cube-outline"] = "📦",
        ["document-outline"] = "📄",
        ["funnel-outline"] = "🔽",
        ["git-branch-outline"] = "🔀",
        ["git-network-outline"] = "🕸️",
        ["grid-outline"] = "🔢",
        ["layers-outline"] = "📚",
        ["list-outline"] = "📋",
        ["refresh-outline"] = "🔁",
        ["rocket-outline"] = "🚀",
        ["search-outline"] = "🔍",
    };

    public static string Emoji(string? name, string fallback = "📘")
    {
        if (string.IsNullOrWhiteSpace(name)) return fallback;
        // Si c'est déjà un emoji (pas un identifiant Ionicon), on le garde.
        if (!name.Contains('-') && name.Length <= 3) return name;
        return Map.TryGetValue(name, out var e) ? e : fallback;
    }
}

public static class UiKit
{
    /// <summary>Gros bouton arrondi avec effet de relief (couleur + ombre plus foncée dessous).</summary>
    public static Border BigButton(string text, Color fill, Color shadow, EventHandler<TappedEventArgs>? onTap = null)
    {
        var label = new Label
        {
            Text = text.ToUpperInvariant(),
            TextColor = Colors.White,
            FontAttributes = FontAttributes.Bold,
            FontSize = 16,
            HorizontalOptions = LayoutOptions.Center,
            VerticalOptions = LayoutOptions.Center,
        };

        var border = new Border
        {
            BackgroundColor = fill,
            StrokeThickness = 0,
            HeightRequest = 52,
            Content = label,
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 16 },
            Shadow = new Shadow { Brush = shadow, Offset = new Point(0, 4), Radius = 0, Opacity = 1f },
        };

        if (onTap != null)
        {
            var tap = new TapGestureRecognizer();
            tap.Tapped += onTap;
            border.GestureRecognizers.Add(tap);
        }
        return border;
    }

    public static Border PrimaryButton(string text, EventHandler<TappedEventArgs> onTap) =>
        BigButton(text, Theme.Feather, Theme.FeatherDark, onTap);

    public static Border BlueButton(string text, EventHandler<TappedEventArgs> onTap) =>
        BigButton(text, Theme.Macaw, Theme.MacawDark, onTap);

    /// <summary>Bloc de code monospace sur fond sombre.</summary>
    public static Border CodeBlock(string code) => new()
    {
        BackgroundColor = Color.FromArgb("#2B2B2B"),
        StrokeThickness = 0,
        Padding = 16,
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 12 },
        Content = new Label
        {
            Text = code,
            TextColor = Color.FromArgb("#E6E6E6"),
            FontFamily = "Consolas",
            FontAutoScalingEnabled = false,
            FontSize = 14,
            LineHeight = 1.4,
        },
    };

    public static Label Title(string text) => new()
    {
        Text = text,
        FontSize = 26,
        FontAttributes = FontAttributes.Bold,
        TextColor = Theme.Wolf,
    };

    /// <summary>Champ de saisie encadré façon Duolingo.</summary>
    public static Border TextField(Entry entry)
    {
        entry.BackgroundColor = Colors.Transparent;
        entry.TextColor = Theme.Wolf;
        return new Border
        {
            BackgroundColor = Theme.Polar,
            Stroke = Theme.Swan,
            StrokeThickness = 2,
            Padding = new Thickness(14, 2),
            StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 14 },
            Content = entry,
        };
    }

    /// <summary>Petite pastille d'info (XP, coeurs, série) pour les en-têtes.</summary>
    public static HorizontalStackLayout StatPill(string emoji, Label valueLabel)
    {
        return new HorizontalStackLayout
        {
            Spacing = 4,
            VerticalOptions = LayoutOptions.Center,
            Children =
            {
                new Label { Text = emoji, FontSize = 18, VerticalOptions = LayoutOptions.Center },
                valueLabel,
            },
        };
    }
}
