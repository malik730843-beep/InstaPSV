const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'src', 'messages');

const translations = {
    en: {
        titleStart: "Boost Your Instagram Reach with",
        titleHighlight: "Hashtags",
        subtitle: "Get the most effective, trending hashtags for your posts and skyrocket your organic reach instantly.",
        storyViewer: {
            title: "AI Hashtag Generator",
            description: "Generate highly relevant hashtags instantly from any category or keyword."
        },
        highlightsViewer: {
            title: "Growth Strategy",
            description: "Structure your tags using broad, niche, and branded categories for maximum reach."
        },
        postGrid: {
            title: "Shadowban Safe",
            description: "All hashtags are verified to ensure your account remains safe and compliant."
        },
        reelsPlayer: {
            title: "Easy Copy & Export",
            description: "Select your preferred tags and copy them to your clipboard in one tap."
        }
    },
    de: {
        titleStart: "Steigern Sie Ihre Instagram-Reichweite mit",
        titleHighlight: "Hashtags",
        subtitle: "Holen Sie sich die effektivsten, trendigsten Hashtags für Ihre Beiträge und steigern Sie Ihre organische Reichweite sofort.",
        storyViewer: {
            title: "KI-Hashtag-Generator",
            description: "Generieren Sie sofort hochrelevante Hashtags aus jeder Kategorie oder jedem Keyword."
        },
        highlightsViewer: {
            title: "Wachstumsstrategie",
            description: "Strukturieren Sie Ihre Tags in breite, Nischen- und Marken-Kategorien für maximale Reichweite."
        },
        postGrid: {
            title: "Shadowban-sicher",
            description: "Alle Hashtags werden überprüft, um sicherzustellen, dass Ihr Konto sicher und richtlinienkonform bleibt."
        },
        reelsPlayer: {
            title: "Einfaches Kopieren & Exportieren",
            description: "Wählen Sie Ihre bevorzugten Tags aus und kopieren Sie sie mit einem Klick in Ihre Zwischenablage."
        }
    },
    es: {
        titleStart: "Aumenta tu alcance en Instagram con",
        titleHighlight: "Hashtags",
        subtitle: "Obtén los hashtags más efectivos y populares para tus publicaciones y aumenta tu alcance orgánico al instante.",
        storyViewer: {
            title: "Generador de Hashtags IA",
            description: "Genera hashtags altamente relevantes al instante desde cualquier categoría o palabra clave."
        },
        highlightsViewer: {
            title: "Estrategia de Crecimiento",
            description: "Estructura tus etiquetas usando categorías amplias, de nicho y de marca para el máximo alcance."
        },
        postGrid: {
            title: "Libre de Shadowban",
            description: "Todos los hashtags están verificados para garantizar que tu cuenta se mantenga segura y cumpla las normas."
        },
        reelsPlayer: {
            title: "Copiar y Exportar Fácil",
            description: "Selecciona tus etiquetas preferidas y cópialas en tu portapapeles con un solo toque."
        }
    },
    fr: {
        titleStart: "Boostez votre portée Instagram avec des",
        titleHighlight: "Hashtags",
        subtitle: "Obtenez les hashtags les plus efficaces et tendance pour vos publications et augmentez instantanément votre portée organique.",
        storyViewer: {
            title: "Générateur de Hashtags IA",
            description: "Générez instantanément des hashtags très pertinents à partir de n'importe quelle catégorie ou mot-clé."
        },
        highlightsViewer: {
            title: "Stratégie de Croissance",
            description: "Structurez vos tags en utilisant des catégories larges, de niche et de marque pour une portée maximale."
        },
        postGrid: {
            title: "Sans Shadowban",
            description: "Tous les hashtags sont vérifiés pour garantir que votre compte reste sécurisé et conforme."
        },
        reelsPlayer: {
            title: "Copier & Exporter Facilement",
            description: "Sélectionnez vos tags préférés et copiez-les dans votre presse-papiers en un clic."
        }
    },
    it: {
        titleStart: "Aumenta la tua copertura su Instagram con gli",
        titleHighlight: "Hashtag",
        subtitle: "Ottieni gli hashtag più efficaci e di tendenza per i tuoi post e aumenta istantaneamente la tua copertura organica.",
        storyViewer: {
            title: "Generatore di Hashtag IA",
            description: "Genera istantaneamente hashtag altamente pertinenti da qualsiasi categoria o parola chiave."
        },
        highlightsViewer: {
            title: "Strategia di Crescita",
            description: "Struttura i tuoi tag utilizzando categorie ampie, di nicchia e di marca per la massima copertura."
        },
        postGrid: {
            title: "Sicuro da Shadowban",
            description: "Tutti gli hashtag sono verificati per garantire che il tuo account rimanga sicuro e conforme."
        },
        reelsPlayer: {
            title: "Copia ed Esporta Facile",
            description: "Seleziona i tuoi tag preferiti e copiali negli appunti con un solo tocco."
        }
    },
    nl: {
        titleStart: "Vergroot je Instagram-bereik met",
        titleHighlight: "Hashtags",
        subtitle: "Krijg de meest effectieve, trending hashtags voor je berichten en vergroot direct je organische bereik.",
        storyViewer: {
            title: "AI Hashtag Generator",
            description: "Genereer direct zeer relevante hashtags op basis van elke categorie of zoekwoord."
        },
        highlightsViewer: {
            title: "Groeistrategie",
            description: "Structureer je tags met behulp van brede, niche- en merkcategorieën voor maximaal bereik."
        },
        postGrid: {
            title: "Shadowban Veilig",
            description: "Alle hashtags zijn geverifieerd om ervoor te zorgen dat je account veilig en compliant blijft."
        },
        reelsPlayer: {
            title: "Eenvoudig Kopiëren & Exporteren",
            description: "Selecteer je favoriete tags en kopieer ze met één tik naar je klembord."
        }
    },
    da: {
        titleStart: "Øg din Instagram-rækkevidde med",
        titleHighlight: "Hashtags",
        subtitle: "Få de mest effektive, trending hashtags til dine opslag og øg din organiske rækkevidde med det samme.",
        storyViewer: {
            title: "AI Hashtag Generator",
            description: "Generer yderst relevante hashtags med det samme fra enhver kategori eller søgeord."
        },
        highlightsViewer: {
            title: "Vækststrategi",
            description: "Strukturer dine tags ved hjælp af brede, niche- og brandkategorier for maksimal rækkevidde."
        },
        postGrid: {
            title: "Shadowban Sikker",
            description: "Alle hashtags er verificeret for at sikre, at din konto forbliver sikker og overholder reglerne."
        },
        reelsPlayer: {
            title: "Nem Kopiering & Eksport",
            description: "Vælg dine foretrukne tags og kopier dem til din udklipsholder med et enkelt tryk."
        }
    },
    no: {
        titleStart: "Øk din Instagram-rekkevidde med",
        titleHighlight: "Hashtags",
        subtitle: "Få de mest effektive, trending hashtags til innleggene dine og øk din organiske rekkevidde umiddelbaar.",
        storyViewer: {
            title: "AI Hashtag Generator",
            description: "Generer svært relevante hashtags umiddelbart fra enhver kategori eller søkeord."
        },
        highlightsViewer: {
            title: "Vekststrategi",
            description: "Strukturer dine tags ved hjelp av brede, nisje- og merkevarekategorier for maksimal rekkevidde."
        },
        postGrid: {
            title: "Shadowban Sikker",
            description: "Alle hashtags er verifisert for å sikre at kontoen din forblir sikker og i samsvar med reglene."
        },
        reelsPlayer: {
            title: "Enkel Kopiering & Eksport",
            description: "Velg dine foretrukne tags og kopier dem til utklippstavlen med ett trykk."
        }
    },
    sv: {
        titleStart: "Öka din Instagram-räckvidd med",
        titleHighlight: "Hashtags",
        subtitle: "Få de mest effektiva, trendiga hashtags för dina inlägg och öka din organiska räckvidd direkt.",
        storyViewer: {
            title: "AI Hashtag Generator",
            description: "Generera mycket relevanta hashtags direkt från valfri kategori eller sökord."
        },
        highlightsViewer: {
            title: "Tillväxtstrategi",
            description: "Strukturera dina taggar med hjälp av breda, nischade och varumärkeskategorier för maximal räckvidd."
        },
        postGrid: {
            title: "Shadowban Säker",
            description: "Alla hashtags är verifierade för att säkerställa att ditt konto förblir säkert och följer reglerna."
        },
        reelsPlayer: {
            title: "Enkel Kopiering & Export",
            description: "Välj dina favorittaggar och kopiera dem till ditt urklipp med ett enda tryck."
        }
    }
};

fs.readdirSync(MESSAGES_DIR).forEach((file) => {
    if (!file.endsWith('.json')) return;
    const lang = file.replace('.json', '');
    const filePath = path.join(MESSAGES_DIR, file);
    
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        const updateData = translations[lang] || translations['en'];
        
        if (data.features) {
            data.features.titleStart = updateData.titleStart;
            data.features.titleHighlight = updateData.titleHighlight;
            data.features.subtitle = updateData.subtitle;
            
            if (data.features.storyViewer) {
                data.features.storyViewer.title = updateData.storyViewer.title;
                data.features.storyViewer.description = updateData.storyViewer.description;
            }
            if (data.features.highlightsViewer) {
                data.features.highlightsViewer.title = updateData.highlightsViewer.title;
                data.features.highlightsViewer.description = updateData.highlightsViewer.description;
            }
            if (data.features.postGrid) {
                data.features.postGrid.title = updateData.postGrid.title;
                data.features.postGrid.description = updateData.postGrid.description;
            }
            if (data.features.reelsPlayer) {
                data.features.reelsPlayer.title = updateData.reelsPlayer.title;
                data.features.reelsPlayer.description = updateData.reelsPlayer.description;
            }
        }
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
        console.log(`Updated ${file} successfully.`);
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
});
