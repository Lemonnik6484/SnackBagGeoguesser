export function showNotification(status, msg) {
    const notification = document.createElement("div");
    notification.textContent = msg;

    Object.assign(notification.style, {
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: "5px",
        color: "#fff",
        backgroundColor: status === "success" ? "#4caf50b3" : "#f44336b3",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        fontSize: "16px",
        zIndex: "1000",
        opacity: "1",
        transition: "opacity 0.5s ease",
    });

    notification.classList.add("notification");

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.addEventListener("transitionend", () => notification.remove());
    }, 3000);
}
