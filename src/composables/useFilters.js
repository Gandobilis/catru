import {ref} from "vue";
import axiosInstance from "/src/interceptors/axios/index.js";

export default function useFilters() {
    const data = ref();
    const totalPages = ref(0);
    const currentPage = ref(1);

    const getData = async (filters = {}) => {
        const filteredParams = {};

        if (filters.Status) filteredParams.Status = filters.Status;
        if (filters.FormType) filteredParams.FormType = filters.FormType;
        if (filters.ReceiptDate) filteredParams.ReceiptDate = filters.ReceiptDate;
        if (filters.IDNumber) filteredParams.IDNumber = filters.IDNumber;

        filteredParams.page = currentPage.value;

        const queryParams = new URLSearchParams(filteredParams).toString();

        await axiosInstance.get(`consent-forms?${queryParams}`, {
            headers: {
                "ngrok-skip-browser-warning": "69420" // წასაშლელია
            }
        }).then(res => {
            data.value = res.data.data;
            totalPages.value = res.data.totalPage;
        }).catch(err => console.error(err));
    };

    return {
        getData,
        data,
        currentPage,
        totalPages,
    };
}
