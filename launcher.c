#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CLOUD_APP_URL "https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app"
#define LOCAL_APP_URL "http://localhost:3000"

int launchInDedicatedAppWindow(const char* targetUrl) {
    char cmd[1024];

    // 1. Try launching in Microsoft Edge app mode (installed on all Windows 10/11 PCs)
    snprintf(cmd, sizeof(cmd), "start msedge --app=\"%s\" --window-size=1280,840", targetUrl);
    int res = system(cmd);
    if (res == 0) return 0;

    // 2. Try Google Chrome app mode
    snprintf(cmd, sizeof(cmd), "start chrome --app=\"%s\" --window-size=1280,840", targetUrl);
    res = system(cmd);
    if (res == 0) return 0;

    // 3. Fallback to default browser
    HINSTANCE hInst = ShellExecuteA(NULL, "open", targetUrl, NULL, NULL, SW_SHOWNORMAL);
    return ((INT_PTR)hInst > 32) ? 0 : 1;
}

int main(int argc, char* argv[]) {
    // 1. Set current working directory to the directory where GameShrinkPro.exe is located
    char exePath[MAX_PATH];
    if (GetModuleFileNameA(NULL, exePath, MAX_PATH)) {
        char* lastSlash = strrchr(exePath, '\\');
        if (lastSlash) {
            *lastSlash = '\0';
            SetCurrentDirectoryA(exePath);
        }
    }

    SetConsoleTitleA("GameShrink Pro - Extreme Optimization Engine");
    system("color 0b");

    printf("=================================================================\n");
    printf("             GameShrink Pro - Extreme Optimization Engine         \n");
    printf("=================================================================\n\n");

    // Check if package.json exists in this folder (i.e. user is in the full source folder)
    DWORD pkgAttr = GetFileAttributesA("package.json");
    int hasPackageJson = (pkgAttr != INVALID_FILE_ATTRIBUTES && !(pkgAttr & FILE_ATTRIBUTE_DIRECTORY));

    // Check if node is installed
    int hasNode = (system("where node >nul 2>nul") == 0);

    if (hasPackageJson && hasNode) {
        printf("[MODE] Local Source Repository Detected.\n");

        DWORD nodeModulesAttr = GetFileAttributesA("node_modules");
        int hasNodeModules = (nodeModulesAttr != INVALID_FILE_ATTRIBUTES && (nodeModulesAttr & FILE_ATTRIBUTE_DIRECTORY));

        if (!hasNodeModules) {
            printf("[INFO] Initializing dependencies (npm install)...\n");
            int installResult = system("call npm install");
            if (installResult != 0) {
                printf("[WARNING] Local npm install encountered an error.\n");
                printf("[INFO] Switching to ultra-fast Direct Engine mode...\n\n");
                launchInDedicatedAppWindow(CLOUD_APP_URL);
                return 0;
            }
        }

        printf("[OK] Starting local engine server on http://localhost:3000...\n");
        printf("[OK] Opening GameShrink Pro Desktop Window...\n\n");
        
        // Launch app window pointing to localhost
        launchInDedicatedAppWindow(LOCAL_APP_URL);

        // Run local dev server
        system("call npm run dev");
        return 0;
    }

    // STANDALONE / PORTABLE MODE:
    // User downloaded GameShrinkPro.exe alone (e.g. into Downloads or Desktop)
    printf("[MODE] Standalone Windows Portable Executable.\n");
    printf("[INFO] Connecting to GameShrink Pro Engine...\n");
    printf("[INFO] Opening native dedicated Desktop Window...\n\n");

    int launchSuccess = launchInDedicatedAppWindow(CLOUD_APP_URL);
    if (launchSuccess != 0) {
        // Ultimate fallback
        ShellExecuteA(NULL, "open", CLOUD_APP_URL, NULL, NULL, SW_SHOWNORMAL);
    }

    printf("[SUCCESS] GameShrink Pro is active!\n");
    printf("You can minimize this window. Closing it will exit.\n\n");

    // Keep console friendly
    Sleep(3000);
    return 0;
}
