using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Duodingo.Models;

namespace Duodingo.Services;

/// <summary>Client HTTP du backend Duodingo. Gère le token JWT et la désérialisation JSON.</summary>
public class ApiService
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public string? Token { get; private set; }
    public User? CurrentUser { get; set; }

    public ApiService()
    {
        _http = new HttpClient { BaseAddress = new Uri(AppConfig.ApiBaseUrl + "/") };
    }

    public bool IsAuthenticated => !string.IsNullOrEmpty(Token);

    public async Task LoadTokenAsync()
    {
        Token = await SecureStorage.Default.GetAsync("token");
    }

    private async Task SetTokenAsync(string token)
    {
        Token = token;
        await SecureStorage.Default.SetAsync("token", token);
    }

    public void Logout()
    {
        Token = null;
        CurrentUser = null;
        SecureStorage.Default.Remove("token");
    }

    private HttpRequestMessage Build(HttpMethod method, string endpoint, object? body = null)
    {
        var req = new HttpRequestMessage(method, endpoint.TrimStart('/'));
        if (!string.IsNullOrEmpty(Token))
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Token);
        if (body != null)
            req.Content = JsonContent.Create(body, options: JsonOpts);
        return req;
    }

    private async Task<T> SendAsync<T>(HttpRequestMessage req)
    {
        HttpResponseMessage res;
        try
        {
            res = await _http.SendAsync(req);
        }
        catch (Exception ex)
        {
            throw new ApiException($"Connexion au serveur impossible. ({ex.Message})");
        }

        var raw = await res.Content.ReadAsStringAsync();
        if (!res.IsSuccessStatusCode)
        {
            var msg = "Erreur serveur.";
            try
            {
                var doc = JsonDocument.Parse(raw);
                if (doc.RootElement.TryGetProperty("message", out var m))
                    msg = m.GetString() ?? msg;
            }
            catch { /* corps non-JSON */ }
            throw new ApiException(msg);
        }

        if (typeof(T) == typeof(bool)) return (T)(object)true;
        return JsonSerializer.Deserialize<T>(raw, JsonOpts)!;
    }

    // ---- Auth ----
    public async Task<AuthResponse> RegisterAsync(string username, string email, string password)
    {
        var res = await SendAsync<AuthResponse>(Build(HttpMethod.Post, "auth/register",
            new { username, email, password }));
        await SetTokenAsync(res.Token);
        CurrentUser = res.User;
        return res;
    }

    public async Task<AuthResponse> LoginAsync(string email, string password)
    {
        var res = await SendAsync<AuthResponse>(Build(HttpMethod.Post, "auth/login",
            new { email, password }));
        await SetTokenAsync(res.Token);
        CurrentUser = res.User;
        return res;
    }

    public async Task<User> GetMeAsync()
    {
        var res = await SendAsync<MeResponse>(Build(HttpMethod.Get, "auth/me"));
        CurrentUser = res.User;
        return res.User;
    }

    // ---- Languages / Topics / Lessons ----
    public Task<List<Language>> GetLanguagesAsync() =>
        SendAsync<List<Language>>(Build(HttpMethod.Get, "languages"));

    public Task<List<Topic>> GetTopicsAsync(string languageId) =>
        SendAsync<List<Topic>>(Build(HttpMethod.Get, $"languages/{languageId}/topics"));

    public Task<List<LessonSummary>> GetLessonsAsync(string languageId, string topicId) =>
        SendAsync<List<LessonSummary>>(Build(HttpMethod.Get, $"languages/{languageId}/topics/{topicId}/lessons"));

    public Task<Lesson> GetLessonAsync(string lessonId) =>
        SendAsync<Lesson>(Build(HttpMethod.Get, $"lessons/{lessonId}"));

    public Task<CompleteLessonResponse> CompleteLessonAsync(string lessonId, int score, int correctAnswers, int totalExercises) =>
        SendAsync<CompleteLessonResponse>(Build(HttpMethod.Post, $"lessons/{lessonId}/complete",
            new { score, correctAnswers, totalExercises }));

    // ---- Progress ----
    public Task<Stats> GetStatsAsync() =>
        SendAsync<Stats>(Build(HttpMethod.Get, "progress/stats"));

    public Task<List<LeaderboardEntry>> GetLeaderboardAsync() =>
        SendAsync<List<LeaderboardEntry>>(Build(HttpMethod.Get, "progress/leaderboard"));

    public Task<HeartsResponse> GetHeartsAsync() =>
        SendAsync<HeartsResponse>(Build(HttpMethod.Get, "progress/hearts"));

    public Task<HeartsResponse> UpdateHeartsAsync(string action) =>
        SendAsync<HeartsResponse>(Build(HttpMethod.Post, "progress/hearts", new { action }));

    // ---- Challenges ----
    public Task<Challenge> GetTodayChallengeAsync() =>
        SendAsync<Challenge>(Build(HttpMethod.Get, "challenges/today"));

    public Task<ChallengeResult> CompleteChallengeAsync(string answer) =>
        SendAsync<ChallengeResult>(Build(HttpMethod.Post, "challenges/today/complete", new { answer }));
}

public class ApiException : Exception
{
    public ApiException(string message) : base(message) { }
}
