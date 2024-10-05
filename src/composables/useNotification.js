import { ref } from "vue";

// Shared state for notification and editable
const notification = ref(null);
const editable = ref(false);
const formType = ref('MT')
export default function useNotification() {
    // Notification related methods
    const setNotification = (message) => {
        notification.value = message;
    };


    const clearNotification = () => {
        notification.value = null;
    };

    // Editable related methods
    const setEditable = (value) => {
        editable.value = value;
    };

    const toggleEditable = () => {
        editable.value = !editable.value;
    };

    return {
        notification,
        setNotification,
        clearNotification,
        editable,
        setEditable,
        toggleEditable,
        formType
    };
}
