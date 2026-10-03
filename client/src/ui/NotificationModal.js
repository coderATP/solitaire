// client/js/ui/NotificationModal.js

class NotificationModal {
    constructor() {
        this.modal = null;
    }

    getIcon(type) {
        return (
            {
                success: "✅",
                error: "❌",
                warning: "⚠️",
                info: "ℹ️"
            }[type] || "ℹ️"
        );
    }

    open({
        title = "Notification",
        message = "",
        type = "info",
        showCancel = false,
        confirmText = "OK",
        cancelText = "Cancel",
        onConfirm = null,
        onCancel = null
    } = {}) {
        if (this.modal) return;

        this.modal = document.createElement("div");
        this.modal.className = "ps-notify-overlay";

        const icon = this.getIcon(type);

        this.modal.innerHTML = `
            <div class="ps-notify-container ${type}">
                
                <div class="ps-notify-header">
                    <span class="ps-notify-icon">${icon}</span>
                    <span class="ps-notify-title">${this.formatMessageText(title)}</span>
                    <button id="ps-notify-close">✕</button>
                </div>

               <div class="ps-notify-body">
    ${this.formatMessageText(message)}
</div>

                <div class="ps-notify-actions">
                    ${showCancel ? `<button id="ps-notify-cancel">${cancelText}</button>` : ""}
                    <button id="ps-notify-confirm">${confirmText}</button>
                </div>

            </div>
        `;

        document.body.appendChild(this.modal);
        this.bindEvents({ onConfirm, onCancel });
    }

    close() {
        if (!this.modal) return;

        const container = this.modal.querySelector(".ps-notify-container");
        container.classList.add("hide");

        setTimeout(() => {
            this.modal?.remove();
            this.modal = null;
        }, 250); // match animation duration
    }

    bindEvents({ onConfirm, onCancel }) {
        const closeBtn = this.modal.querySelector("#ps-notify-close");
        const confirmBtn = this.modal.querySelector("#ps-notify-confirm");
        const cancelBtn = this.modal.querySelector("#ps-notify-cancel");

        closeBtn.onclick = () => {
            if (onCancel) onCancel();
            this.close();
        };
        confirmBtn.onclick = () => {
            if (onConfirm) onConfirm();
            this.close();
        };

        if (cancelBtn) {
            cancelBtn.onclick = () => {
                if (onCancel) onCancel();
                this.close();
            };
        }
    }
    formatMessageText(raw) {
        if (!raw) return "";

        return raw
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/_(.+?)_/g, "<em>$1</em>")
            .replace(/\^(.+?)\^/g, "<sup>$1</sup>")
            .replace(/~(.+?)~/g, "<sub>$1</sub>")
            .replace(/\n/g, "<br>");
    }
}

export default new NotificationModal();
