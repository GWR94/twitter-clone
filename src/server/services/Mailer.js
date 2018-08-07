const sendGrid = require("sendgrid");
const helper = sendGrid.helper;
const keys = require("../config/keys");

class Mailer extends helper.Mail {
    constructor({
        recipient
    }, content) {
        super();

        this.sgAPI = sendGrid(keys.sendGridKey);
        this.from_email = new helper.Email("no-reply@twitter.com");
        this.subject = "Confirm your email address.";
        this.body = content;
        this.recipient = this.formatAddress(recipient);

        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses(recipient) {
        return new helper.Email(recipient.email);
    }

    addClickTracking() {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    addRecipients(recipient) {
        const personalize = new helper.Personalization();
        personalize.addTo(recipient);

        this.addPersonalization(personalize);
    }

    async send() {
        const request = this
            .sgAPI
            .emptyRequest({
                method: "POST",
                path: "/v3/mail/send",
                body: this.toJSON()
            });

        const response = await this
            .sgAPI
            .API(request);
        return response;
    }
}

module.exports = Mailer;
