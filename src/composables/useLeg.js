import {ref} from "vue";

export default function useLeg() {
    const company = ref(null);  // Store all company data here
    const tax = ref();
    const loadingLeg = ref(false);
    const editable = ref(false);
    const isValidTax = ref();
    const error = ref(null);
    const clientName = ref()
    const tax_number = ref()
    const legPearson = ref()
    const legPearsonTax = ref()
    const getCompany = async () => {
        loadingLeg.value = true;
        error.value = null;
        try {
            const response = await fetch(`http://localhost:3000/companies?tax_number=${tax.value}`);
            const data = await response.json();

            if (data.length > 0) {
                company.value = data[0];
                console.log(company.value);
            } else {
                throw new Error("Company not found");
            }
        } catch (err) {
            console.error("Error fetching company:", err);
            error.value = err.message || "An error occurred while fetching company data";
        } finally {
            loadingLeg.value = false;
        }
    };

    return {
        company,
        legPearson,
        tax,
        loadingLeg,
        editable,
        isValidTax,
        error,
        getCompany,
        clientName,
        tax_number,
        legPearsonTax
    };
}
