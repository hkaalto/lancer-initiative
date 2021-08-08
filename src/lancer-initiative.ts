import { LancerCombat, LancerCombatant } from "./module/lancer-combat.js";
import { LancerCombatTracker } from "./module/lancer-combat-tracker.js";
import { LIForm } from "./module/li-form.js";

type Appearance = typeof LancerCombatTracker["trackerAppearance"];
const module = "lancer-initiative";
const templatePath = "modules/lancer-initiative/templates/lancer-combat-tracker.html";

function registerSettings(): void {
  console.log("lancer-initiative | Initializing Lancer Initiative Module");
  const config = LancerCombatTracker.trackerConfig;
  config.module = module;
  config.templatePath = templatePath;

  switch (game.system.id) {
    case "lancer":
      config.def_appearance.icon = "cci cci-activate";
      config.def_appearance.icon_size = 2;
      break;
    default:
  }

  game.settings.registerMenu(module, "lancerInitiative", {
    name: game.i18n.localize("LANCERINITIATIVE.IconSettingsMenu"),
    label: game.i18n.localize("LANCERINITIATIVE.IconSettingsMenu"),
    type: LIForm,
    restricted: true,
  });
  game.settings.register(module, "combat-tracker-appearance", {
    scope: "world",
    config: false,
    type: Object,
    onChange: setAppearance,
  });
  game.settings.register(module, "combat-tracker-sort", {
    name: game.i18n.localize("LANCERINITIATIVE.SortTracker"),
    hint: game.i18n.localize("LANCERINITIATIVE.SortTrackerDesc"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(module, "combat-tracker-enable-initiative", {
    name: game.i18n.localize("LANCERINITIATIVE.EnableInitiative"),
    hint: game.i18n.localize("LANCERINITIATIVE.EnableInitiativeDesc"),
    scope: "world",
    config: !!CONFIG.Combat.initiative.formula,
    type: Boolean,
    default: false,
  });
  game.settings.register(module, "combat-tracker-activation-path", {
    scope: "world",
    config: false,
    type: String,
    default: "derived.mm.Activations",
  });
  game.settings.register(module, "combat-tracker-migrated-settings", {
    scope: "world",
    config: false,
    type: Number,
    default: 1,
  });

  // Override classes
  CONFIG.Combat.documentClass = LancerCombat;
  CONFIG.Combatant.documentClass = LancerCombatant;
  CONFIG.ui.combat = LancerCombatTracker;

  // Call hooks for initialization of Lancer Initiative
  Hooks.callAll("LancerIntitaitveInit");

  // Set the css vars
  setAppearance(LancerCombatTracker.trackerAppearance);
}

function setAppearance(val: Partial<Appearance>): void {
  const defaults = LancerCombatTracker.trackerConfig.def_appearance;
  document.documentElement.style.setProperty(
    "--lancer-initiative-icon-size",
    `${val?.icon_size ?? defaults.icon_size}rem`
  );
  document.documentElement.style.setProperty(
    "--lancer-initiative-player-color",
    val?.player_color ?? defaults.player_color
  );
  document.documentElement.style.setProperty(
    "--lancer-initiative-friendly-color",
    val?.friendly_color ?? defaults.friendly_color
  );
  document.documentElement.style.setProperty(
    "--lancer-initiative-neutral-color",
    val?.neutral_color ?? defaults.neutral_color
  );
  document.documentElement.style.setProperty(
    "--lancer-initiative-enemy-color",
    val?.enemy_color ?? defaults.enemy_color
  );
  document.documentElement.style.setProperty(
    "--lancer-initiative-done-color",
    val?.done_color ?? defaults.done_color
  );
  game.combats?.render();
}

Hooks.once("init", registerSettings);
