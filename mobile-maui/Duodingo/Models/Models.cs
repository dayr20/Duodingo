using System.Text.Json;
using System.Text.Json.Serialization;

namespace Duodingo.Models;

public class User
{
    [JsonPropertyName("id")] public string? Id { get; set; }
    [JsonPropertyName("username")] public string Username { get; set; } = "";
    [JsonPropertyName("email")] public string Email { get; set; } = "";
    [JsonPropertyName("xp")] public int Xp { get; set; }
    [JsonPropertyName("level")] public int Level { get; set; } = 1;
    [JsonPropertyName("hearts")] public int Hearts { get; set; } = 5;
    [JsonPropertyName("streak")] public int Streak { get; set; }
    [JsonPropertyName("avatar")] public string? Avatar { get; set; }
    [JsonPropertyName("achievements")] public List<Achievement> Achievements { get; set; } = new();
}

public class Achievement
{
    [JsonPropertyName("name")] public string Name { get; set; } = "";
    [JsonPropertyName("icon")] public string Icon { get; set; } = "🏅";
}

public class AuthResponse
{
    [JsonPropertyName("token")] public string Token { get; set; } = "";
    [JsonPropertyName("user")] public User User { get; set; } = new();
}

public class MeResponse
{
    [JsonPropertyName("user")] public User User { get; set; } = new();
}

public class Language
{
    [JsonPropertyName("_id")] public string Id { get; set; } = "";
    [JsonPropertyName("name")] public string Name { get; set; } = "";
    [JsonPropertyName("slug")] public string Slug { get; set; } = "";
    [JsonPropertyName("icon")] public string Icon { get; set; } = "💻";
    [JsonPropertyName("color")] public string Color { get; set; } = "#58CC02";
    [JsonPropertyName("description")] public string Description { get; set; } = "";
    [JsonPropertyName("order")] public int Order { get; set; }
}

public class Topic
{
    [JsonPropertyName("_id")] public string Id { get; set; } = "";
    [JsonPropertyName("name")] public string Name { get; set; } = "";
    [JsonPropertyName("slug")] public string Slug { get; set; } = "";
    [JsonPropertyName("icon")] public string Icon { get; set; } = "📘";
    [JsonPropertyName("order")] public int Order { get; set; }
    [JsonPropertyName("requiredXP")] public int RequiredXp { get; set; }
    [JsonPropertyName("description")] public string Description { get; set; } = "";
}

public class LessonSummary
{
    [JsonPropertyName("_id")] public string Id { get; set; } = "";
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("order")] public int Order { get; set; }
    [JsonPropertyName("xpReward")] public int XpReward { get; set; }
    [JsonPropertyName("description")] public string Description { get; set; } = "";
}

public class Lesson
{
    [JsonPropertyName("_id")] public string Id { get; set; } = "";
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("order")] public int Order { get; set; }
    [JsonPropertyName("xpReward")] public int XpReward { get; set; }
    [JsonPropertyName("description")] public string Description { get; set; } = "";
    [JsonPropertyName("exercises")] public List<Exercise> Exercises { get; set; } = new();
}

public class Exercise
{
    [JsonPropertyName("type")] public string Type { get; set; } = "qcm";
    [JsonPropertyName("question")] public string Question { get; set; } = "";
    [JsonPropertyName("codeSnippet")] public string? CodeSnippet { get; set; }
    [JsonPropertyName("options")] public List<ExerciseOption> Options { get; set; } = new();
    [JsonPropertyName("correctAnswer")] public JsonElement CorrectAnswer { get; set; }
    [JsonPropertyName("explanation")] public string Explanation { get; set; } = "";
    [JsonPropertyName("xpReward")] public int XpReward { get; set; } = 10;

    /// <summary>Réponse attendue pour les types à réponse unique (qcm, fill_code, true_false).</summary>
    public string CorrectAnswerText =>
        CorrectAnswer.ValueKind == JsonValueKind.String ? (CorrectAnswer.GetString() ?? "") : "";

    /// <summary>Ordre attendu des lignes pour le type order_code.</summary>
    public List<string> CorrectAnswerList =>
        CorrectAnswer.ValueKind == JsonValueKind.Array
            ? CorrectAnswer.EnumerateArray().Select(e => e.GetString() ?? "").ToList()
            : new List<string>();
}

public class ExerciseOption
{
    [JsonPropertyName("text")] public string Text { get; set; } = "";
    [JsonPropertyName("isCorrect")] public bool IsCorrect { get; set; }
}

public class CompleteLessonResponse
{
    [JsonPropertyName("xpEarned")] public int XpEarned { get; set; }
    [JsonPropertyName("totalXP")] public int TotalXp { get; set; }
    [JsonPropertyName("level")] public int Level { get; set; }
    [JsonPropertyName("streak")] public int Streak { get; set; }
    [JsonPropertyName("score")] public int Score { get; set; }
    [JsonPropertyName("newAchievements")] public List<Achievement> NewAchievements { get; set; } = new();
}

public class Stats
{
    [JsonPropertyName("xp")] public int Xp { get; set; }
    [JsonPropertyName("level")] public int Level { get; set; }
    [JsonPropertyName("streak")] public int Streak { get; set; }
    [JsonPropertyName("hearts")] public int Hearts { get; set; }
    [JsonPropertyName("totalLessonsCompleted")] public int TotalLessonsCompleted { get; set; }
    [JsonPropertyName("achievements")] public List<Achievement> Achievements { get; set; } = new();
    [JsonPropertyName("memberSince")] public DateTime? MemberSince { get; set; }
}

public class HeartsResponse
{
    [JsonPropertyName("hearts")] public int Hearts { get; set; }
    [JsonPropertyName("nextRegenAt")] public DateTime? NextRegenAt { get; set; }
    [JsonPropertyName("regenMinutes")] public int RegenMinutes { get; set; }
}

public class LeaderboardEntry
{
    [JsonPropertyName("rank")] public int Rank { get; set; }
    [JsonPropertyName("username")] public string Username { get; set; } = "";
    [JsonPropertyName("xp")] public int Xp { get; set; }
    [JsonPropertyName("level")] public int Level { get; set; }
    [JsonPropertyName("streak")] public int Streak { get; set; }
    [JsonPropertyName("avatar")] public string? Avatar { get; set; }
    [JsonPropertyName("isMe")] public bool IsMe { get; set; }
}

public class Challenge
{
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("description")] public string Description { get; set; } = "";
    [JsonPropertyName("language")] public string Language { get; set; } = "";
    [JsonPropertyName("type")] public string Type { get; set; } = "qcm";
    [JsonPropertyName("question")] public string Question { get; set; } = "";
    [JsonPropertyName("codeSnippet")] public string? CodeSnippet { get; set; }
    [JsonPropertyName("options")] public List<ExerciseOption> Options { get; set; } = new();
    [JsonPropertyName("correctAnswer")] public string CorrectAnswer { get; set; } = "";
    [JsonPropertyName("explanation")] public string Explanation { get; set; } = "";
    [JsonPropertyName("xpReward")] public int XpReward { get; set; }
    [JsonPropertyName("completed")] public bool Completed { get; set; }
    [JsonPropertyName("completedCount")] public int CompletedCount { get; set; }
}

public class ChallengeResult
{
    [JsonPropertyName("correct")] public bool Correct { get; set; }
    [JsonPropertyName("explanation")] public string Explanation { get; set; } = "";
    [JsonPropertyName("xpEarned")] public int XpEarned { get; set; }
    [JsonPropertyName("totalXP")] public int TotalXp { get; set; }
    [JsonPropertyName("level")] public int Level { get; set; }
}
