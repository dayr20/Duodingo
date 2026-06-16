using Duodingo.Pages;
using Duodingo.Services;

namespace Duodingo;

public partial class App : Application
{
	/// <summary>Instance unique du client API, partagée par toutes les pages.</summary>
	public static ApiService Api { get; } = new ApiService();

	public App()
	{
		InitializeComponent();
	}

	protected override Window CreateWindow(IActivationState? activationState)
	{
		var window = new Window
		{
			// Écran d'attente le temps de vérifier le token stocké.
			Page = new ContentPage
			{
				BackgroundColor = Color.FromArgb("#58CC02"),
				Content = new ActivityIndicator
				{
					IsRunning = true,
					Color = Colors.White,
					VerticalOptions = LayoutOptions.Center,
					HorizontalOptions = LayoutOptions.Center,
				},
			},
		};

		_ = InitAsync(window);
		return window;
	}

	private static async Task InitAsync(Window window)
	{
		await Api.LoadTokenAsync();
		if (Api.IsAuthenticated)
		{
			try
			{
				await Api.GetMeAsync();
				window.Page = new AppShell();
				return;
			}
			catch
			{
				Api.Logout();
			}
		}
		window.Page = new NavigationPage(new LoginPage());
	}

	/// <summary>Bascule l'application vers le flux d'authentification.</summary>
	public static void ShowLogin()
	{
		MainThread.BeginInvokeOnMainThread(() =>
			Current!.Windows[0].Page = new NavigationPage(new LoginPage()));
	}

	/// <summary>Bascule l'application vers l'app principale (onglets).</summary>
	public static void ShowMain()
	{
		MainThread.BeginInvokeOnMainThread(() =>
			Current!.Windows[0].Page = new AppShell());
	}
}
