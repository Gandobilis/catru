import { ref } from "vue";
import axios from "axios";

export default function useFilters() {
    const getDataUrl = `${import.meta.env.VITE_API_BASE_URL}consent-forms`;

    const data = ref();
    const totalPages = ref(0); // Store the total number of pages
    const currentPage = ref(1); // Default to the first page

    const getData = (filters = {}) => {
        const filteredParams = {};

        if (filters.Status) filteredParams.Status = filters.Status;
        if (filters.FormType) filteredParams.FormType = filters.FormType;
        if (filters.ReceiptDate) filteredParams.ReceiptDate = filters.ReceiptDate;
        if (filters.IDNumber) filteredParams.IDNumber = filters.IDNumber;

        // Include pagination params
        filteredParams.page = currentPage.value;

        const queryParams = new URLSearchParams(filteredParams).toString();
        const fullUrl = `${getDataUrl}?${queryParams}`;

        axios.get(fullUrl, {
            headers: {
                "ngrok-skip-browser-warning": "69420"
            }
        }).then(res => {
            console.log(res.data);
            data.value = res.data.data;
            totalPages.value = res.data.totalPage; // Update the total pages
        }).catch(err => console.error(err));
    };

    return {
        getData,
        data,
        currentPage,
        totalPages,
    };
}
