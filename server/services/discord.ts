import ValidationError from '../errors/validation';
import DatabaseRepository from '../models/DatabaseRepository';
import { Config } from '../types/Config';
import { User } from '../types/User';

const Discord = require('discord.js');

export default class DiscordService {
    config: Config;
    userRepo: DatabaseRepository<User>;

    client: any = null;
    
    constructor(
        config: Config,
        userRepo: DatabaseRepository<User>
    ) {
        this.config = config;
        this.userRepo = userRepo;
    }

    async initialize() {
        if (this.config.discord.botToken) { // Don't initialize the service if there's no token configured.
            this.client = new Discord.Client()
            await this.client.login(this.config.discord.botToken);

            console.log('Discord Initialized');
        }
    }

    isConnected() {
        return this.client != null;
    }

    async updateOAuth(userId, discordUserId, oauth) {
        if (!this.isConnected()) {
            throw new Error(`The Discord integration is not enabled.`);
        }

        let guild = await this.client.guilds.fetch(this.config.discord.serverId);
        let guildMember = await guild.members.resolveID(discordUserId);

        if (!guildMember) {
            throw new ValidationError(`You must be a member of the official Solaris discord server to continue. Please join the server and try again.`);
        }

        await this.userRepo.updateOne({
            _id: userId
        }, {
            $set: {
                'oauth.discord': {
                    userId: discordUserId,
                    token: {
                        access_token: oauth.access_token,
                        token_type: oauth.token_type,
                        expires_in: oauth.expires_in,
                        refresh_token: oauth.refresh_token,
                        scope: oauth.scope
                    }
                }
            }
        });

        const user = await this.client.users.fetch(discordUserId);

        user.send(`Hello there, you've just connected your Solaris account to Discord!\r\n\r\nWe'll start sending notifications to you for in-game events. To change your subscriptions, head over to your user account page.`);
    }

    async clearOAuth(userId) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            $set: {
                'oauth.discord': null
            }
        });
    }

    async sendMessageByUserId(discordUserId: string, messageTemplate: any) {
        const duser = await this.client.users.fetch(discordUserId);

        if (!duser) {
            return;
        }

        try {
            await duser.send({
                embed: messageTemplate
            });
        } catch (err) {
            console.error(err);
        }
    }

    async sendMessageOAuth(user: User, messageTemplate: any) {
        if (!this.isConnected() || !user.oauth.discord || !user.oauth.discord.userId) {
            return
        }
        
        await this.sendMessageByUserId(user.oauth.discord.userId, messageTemplate);
    }
}