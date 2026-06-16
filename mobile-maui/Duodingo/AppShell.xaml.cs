using Duodingo.Pages;

namespace Duodingo;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();

		// Couleurs de la barre d'onglets
		var green = Color.FromArgb("#58CC02");
		var hare = Color.FromArgb("#AFAFAF");
		Shell.SetTabBarBackgroundColor(this, Colors.White);
		Shell.SetTabBarForegroundColor(this, green);
		Shell.SetTabBarUnselectedColor(this, hare);
		Shell.SetTabBarTitleColor(this, green);

		var tabs = new TabBar
		{
			Items =
			{
				MakeTab("Apprendre", "home", new HomePage()),
				MakeTab("Défi", "challenge", new DailyChallengePage()),
				MakeTab("Classement", "leaderboard", new LeaderboardPage()),
				MakeTab("Profil", "profile", new ProfilePage()),
			},
		};
		Items.Add(tabs);

		// Routes pour la navigation détaillée
		Routing.RegisterRoute("path", typeof(PathPage));
		Routing.RegisterRoute("lesson", typeof(LessonPlayPage));
		Routing.RegisterRoute("result", typeof(ResultPage));
	}

	private static ShellContent MakeTab(string title, string route, ContentPage page) => new()
	{
		Title = title,
		Route = route,
		Content = page,
	};
}
