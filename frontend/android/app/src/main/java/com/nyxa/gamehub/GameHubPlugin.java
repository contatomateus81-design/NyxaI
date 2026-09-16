package com.nyxa.gamehub;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.drawable.Drawable;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@CapacitorPlugin(name = "GameHub")
public class GameHubPlugin extends Plugin {

    @PluginMethod
    public void getInstalledGames(PluginCall call) {
        JSArray games = new JSArray();
        
        try {
            PackageManager packageManager = getContext().getPackageManager();
            
            // Intent para buscar atividades principais (launcher)
            Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
            mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
            
            List<ResolveInfo> resolveInfoList = packageManager.queryIntentActivities(mainIntent, 0);
            
            List<GameApp> gameApps = new ArrayList<>();
            
            for (ResolveInfo resolveInfo : resolveInfoList) {
                String packageName = resolveInfo.activityInfo.packageName;
                String appName = resolveInfo.loadLabel(packageManager).toString();
                Drawable icon = resolveInfo.loadIcon(packageManager);
                
                // Heurística simples para identificar jogos:
                // 1. Verifica se tem categoria GAME
                // 2. Ou se o nome contém palavras-chave comuns de jogos
                boolean isGame = false;
                
                try {
                    // Tenta obter informações detalhadas do app
                    var appInfo = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
                    
                    // Verifica categoria GAME
                    if ((appInfo.flags & android.content.pm.ApplicationInfo.FLAG_IS_GAME) != 0) {
                        isGame = true;
                    }
                    
                    // Verifica palavras-chave no nome (opcional, para pegar jogos que não estão marcados corretamente)
                    if (!isGame) {
                        String lowerName = appName.toLowerCase();
                        if (lowerName.contains("game") || 
                            lowerName.contains("play") || 
                            lowerName.contains("racing") || 
                            lowerName.contains("puzzle") ||
                            lowerName.contains("adventure")) {
                            isGame = true;
                        }
                    }
                } catch (Exception e) {
                    Log.w("GameHub", "Erro ao verificar app: " + packageName, e);
                }
                
                if (isGame) {
                    gameApps.add(new GameApp(appName, packageName, icon));
                }
            }
            
            // Ordenar alfabeticamente
            Collections.sort(gameApps, new Comparator<GameApp>() {
                @Override
                public int compare(GameApp g1, GameApp g2) {
                    return g1.name.compareToIgnoreCase(g2.name);
                }
            });
            
            // Converter para JSON
            for (GameApp game : gameApps) {
                JSObject gameObj = new JSObject();
                gameObj.put("name", game.name);
                gameObj.put("packageName", game.packageName);
                // Nota: Ícones são convertidos em base64 no lado do JavaScript se necessário
                games.put(gameObj);
            }
            
            JSObject result = new JSObject();
            result.put("games", games);
            call.resolve(result);
            
        } catch (Exception e) {
            Log.e("GameHub", "Erro ao listar jogos", e);
            call.reject("Erro ao listar jogos: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void launchGame(PluginCall call) {
        String packageName = call.getString("packageName");
        
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name necessário");
            return;
        }
        
        try {
            PackageManager packageManager = getContext().getPackageManager();
            Intent launchIntent = packageManager.getLaunchIntentForPackage(packageName);
            
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(launchIntent);
                call.resolve();
            } else {
                call.reject("Não foi possível abrir o jogo. Talvez ele não esteja instalado.");
            }
        } catch (Exception e) {
            Log.e("GameHub", "Erro ao lançar jogo: " + packageName, e);
            call.reject("Erro ao abrir jogo: " + e.getMessage());
        }
    }
    
    private static class GameApp {
        String name;
        String packageName;
        Drawable icon;
        
        GameApp(String name, String packageName, Drawable icon) {
            this.name = name;
            this.packageName = packageName;
            this.icon = icon;
        }
    }
}
