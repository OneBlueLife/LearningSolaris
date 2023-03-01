"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mentionHelper_exports = {};
__export(mentionHelper_exports, {
  default: () => mentionHelper_default
});
module.exports = __toCommonJS(mentionHelper_exports);
var import_gameHelper = __toESM(require("./gameHelper.js"));
class MentionHelper {
  static MENTION_REGEX = /(#|@)(?:(?:{(.*?)})|([\w\[\]]+))/g;
  static INTERNAL_MENTION_REGEX = /{{(\w)\/(\w+?)\/(.+?)}}/g;
  static HYPERLINK_REGEX = /https?:\/\/\S+/g;
  static STAR_MENTION_CHARACTER = "#";
  static PLAYER_MENTION_CHARACTER = "@";
  addMention(conversation, type, name) {
    const text = conversation.text || "";
    const element = conversation.element;
    const insertionStart = element ? element.selectionStart : text.length - 1;
    const insertionEnd = element ? element.selectionEnd : text.length;
    this.addMentionFromTo(conversation, type, name, insertionStart, insertionEnd);
  }
  addMentionFromTo(conversation, type, name, start, end) {
    const text = conversation.text || "";
    const element = conversation.element;
    const character = this.getMentionCharacter(type);
    let mention;
    if (name.match(/[^\w\[\]]/)) {
      mention = `${character}{${name}}`;
    } else {
      mention = `${character}${name}`;
    }
    const newText = text.substring(0, start) + mention + text.substring(end);
    conversation.text = newText;
    if (element) {
      element.setSelectionRange(start, start + mention.length);
      element.focus();
    }
  }
  makeMentionsStatic(game, originalText) {
    return originalText.replaceAll(MentionHelper.MENTION_REGEX, (match, typeGroup, nameGroup, nameGroup2) => {
      const name = nameGroup || nameGroup2;
      const type = this.getMentionType(typeGroup);
      if (type === "star") {
        return this.makeStarMentionStatic(game, name);
      } else if (type === "player") {
        return this.makePlayerMentionStatic(game, name);
      } else {
        return match;
      }
    });
  }
  makePlayerMentionStatic(game, playerName) {
    const player = import_gameHelper.default.getPlayerByAlias(game, playerName);
    if (player) {
      return this.makeStaticMention("p", player._id, playerName);
    } else {
      return playerName;
    }
  }
  makeStarMentionStatic(game, starName) {
    const star = import_gameHelper.default.getStarByName(game, starName);
    if (star) {
      return this.makeStaticMention("s", star._id, starName);
    } else {
      return starName;
    }
  }
  makeStaticMention(type, id, name) {
    return `{{${type}/${id}/${name}}}`;
  }
  replaceMentionsWithNames(message) {
    try {
      return message.replace(MentionHelper.INTERNAL_MENTION_REGEX, (_match, _type, _id, name) => name);
    } catch (e) {
      console.error(e);
      return message;
    }
  }
  renderTextWithLinks(element, text) {
    let lastLinkEnd = 0;
    for (const match of text.matchAll(MentionHelper.HYPERLINK_REGEX)) {
      const plaintext = text.substring(lastLinkEnd, match.index);
      if (plaintext) {
        const node = document.createTextNode(plaintext);
        element.appendChild(node);
      }
      lastLinkEnd = match.index + match[0].length;
      const linkElement = this.createHyperlinkElement(match[0]);
      element.appendChild(linkElement);
    }
    const lastText = text.substring(lastLinkEnd);
    if (lastText) {
      const node = document.createTextNode(lastText);
      element.appendChild(node);
    }
  }
  renderMessageWithMentionsAndLinks(element, message, onStarClickedCallback, onPlayerClickedCallback) {
    try {
      let lastMentionEnd = 0;
      for (const match of message.matchAll(MentionHelper.INTERNAL_MENTION_REGEX)) {
        const text = message.substring(lastMentionEnd, match.index);
        if (text) {
          this.renderTextWithLinks(element, text);
        }
        lastMentionEnd = match.index + match[0].length;
        const linkElement = this.createMentionLinkElement(match[1], match[2], match[3], onStarClickedCallback, onPlayerClickedCallback);
        element.appendChild(linkElement);
      }
      const lastText = message.substring(lastMentionEnd);
      if (lastText) {
        this.renderTextWithLinks(element, lastText);
      }
    } catch (e) {
      console.error(e);
      const node = document.createTextNode(message);
      element.appendChild(node);
    }
  }
  createHyperlinkElement(url) {
    const node = document.createElement("a");
    node.setAttribute("href", url);
    node.text = url;
    node.setAttribute("target", "_blank");
    return node;
  }
  createMentionLinkElement(type, id, name, onStarClickedCallback, onPlayerClickedCallback) {
    const node = document.createElement("a");
    node.setAttribute("href", "javascript:void(0)");
    node.text = name;
    switch (type) {
      case "s":
        node.onclick = () => {
          onStarClickedCallback(id);
        };
        break;
      case "p":
        node.onclick = () => {
          onPlayerClickedCallback(id);
        };
        break;
    }
    return node;
  }
  getMentionType(character) {
    if (character === MentionHelper.STAR_MENTION_CHARACTER) {
      return "star";
    } else if (character === MentionHelper.PLAYER_MENTION_CHARACTER) {
      return "player";
    } else {
      return null;
    }
  }
  getMentionCharacter(type) {
    if (type === "star") {
      return MentionHelper.STAR_MENTION_CHARACTER;
    } else if (type === "player") {
      return MentionHelper.PLAYER_MENTION_CHARACTER;
    } else {
      return null;
    }
  }
  getCurrentMention(game, element) {
    const text = element.value;
    const cursor = element.selectionEnd;
    const currentMention = this.findAllMentions(text).find((mention) => mention.from <= cursor && mention.to >= cursor);
    if (!currentMention) {
      return null;
    } else {
      return {
        mention: currentMention,
        suggestions: this.findSuggestions(game, currentMention.type, currentMention.name)
      };
    }
  }
  findAllMentions(message) {
    const mentions = [...message.matchAll(MentionHelper.MENTION_REGEX)];
    return mentions.map((match) => {
      return {
        from: match.index,
        to: match.index + match[0].length,
        type: this.getMentionType(match[1]),
        name: match[2] || match[3] || ""
      };
    });
  }
  getToCursor(conversation, from) {
    const element = conversation.element;
    const text = conversation.text || "";
    const cursorPos = element ? element.selectionEnd : text.length;
    return text.substring(from, cursorPos);
  }
  findSuggestions(game, mentionType, mentionText) {
    let suggestionNames = [];
    const mentionStart = mentionText.toLowerCase();
    if (mentionType === "star") {
      suggestionNames = game.galaxy.stars.map((star) => star.name).filter((starName) => starName.toLowerCase().startsWith(mentionStart));
    } else if (mentionType === "player") {
      suggestionNames = game.galaxy.players.map((player) => player.alias).filter((playerName) => playerName.toLowerCase().startsWith(mentionStart));
    }
    return suggestionNames.sort().slice(0, 3);
  }
  useSuggestion(conversation, data) {
    if (!conversation || !data) {
      return;
    }
    const { mention, text } = data;
    this.addMentionFromTo(conversation, mention.type, text, mention.from, mention.to);
  }
}
var mentionHelper_default = new MentionHelper();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=mentionHelper.js.map
