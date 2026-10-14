#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char* argv[]) {
    // 1. Ensure current working directory is the executable's directory
    char exePath[MAX_PATH];
    if (GetModuleFileNameA(NULL, exePath, MAX_PATH)) {
        char* lastSlash = strrchr(exePath, '\\');
        if (lastSlash) {
            *lastSlash = '\0';
            SetCurrentDirectoryA(exePath);
        }
    }

    SetConsoleTitleA("GameShrink Pro - Extreme Optimization Engine");

    // 2. Check if Node.js is installed
    int nodeCheck = system("where node >nul 2>nul");
    if (nodeCheck != 0) {
        MessageBoxA(
            NULL,
            "Node.js is not detected on this PC.\n\n"
            "GameShrink Pro requires Node.js (LTS version) to run its local multithreaded server.\n\n"
            "Click OK to open the official Node.js download page (https://nodejs.org).",
            "GameShrink Pro - Setup Notice",
            MB_ICONINFORMATION | MB_OK
        );
        ShellExecuteA(NULL, "open", "https://nodejs.org", NULL, NULL, SW_SHOWNORMAL);
        return 1;
    }

    // 3. Check if node_modules exists; if not, run npm install
    DWORD fileAttr = GetFileAttributesA("node_modules");
    if (fileAttr == INVALID_FILE_ATTRIBUTES || !(fileAttr & FILE_ATTRIBUTE_DIRECTORY)) {
        printf("=================================================================\n");
        printf("       GameShrink Pro - First-Time Dependency Initialization      \n");
        printf("=================================================================\n");
        printf("[INFO] Installing required dependencies (first-time setup only)...\n");
        printf("[INFO] This will only take about 30 seconds...\n\n");
        
        int installResult = system("call npm install");
        if (installResult != 0) {
            MessageBoxA(
                NULL,
                "Encountered an issue running 'npm install'.\nPlease ensure your internet connection is active.",
                "GameShrink Pro - Error",
                MB_ICONERROR | MB_OK
            );
            return 1;
        }
    }

    // 4. Open default web browser to http://localhost:3000
    printf("\n[INFO] Starting GameShrink Pro Extreme Optimization Engine...\n");
    printf("[INFO] Opening http://localhost:3000 in your browser...\n\n");
    
    // Launch browser asynchronously
    ShellExecuteA(NULL, "open", "http://localhost:3000", NULL, NULL, SW_SHOWNORMAL);

    // 5. Run the local dev server
    system("call npm run dev");

    return 0;
}
