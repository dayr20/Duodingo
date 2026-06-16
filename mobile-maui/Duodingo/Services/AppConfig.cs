namespace Duodingo.Services;

public static class AppConfig
{
    // Android émulateur -> hôte local via 10.0.2.2 ; iOS simulateur -> localhost.
    // Le backend Node.js écoute sur le port 5001.
    public static string ApiBaseUrl =>
#if ANDROID
        "http://10.0.2.2:5001/api";
#else
        "http://localhost:5001/api";
#endif
}
