
import {ref, watch} from "vue";
import useNotification from './useNotification';
import {fa} from "@faker-js/faker";

export default function useLeg() {
    const { notification, setNotification, editable, setEditable, formType  } = useNotification(); // Access shared state

    const company = ref(null);
    const tax = ref();
    const loadingLeg = ref(false);
    const isValidTax = ref();
    const error = ref(null);
    const clientName = ref();
    const isClientNameValid = ref(false)
    const tax_number = ref();
    const is_tax_number_valid = ref(false)
    const legPearson = ref();
    const isLegPersonValid = ref(false)
    const legPersonPhone = ref()
    const isLegPersonPhoneValid = ref(false)
    const legPearsonTax = ref();
    const legPearsonTaxValid = ref(false)

    function disabledLeg() {
        if ((!isClientNameValid.value || !is_tax_number_valid.value || !isLegPersonValid.value || !legPearsonTaxValid.value) && !company.value) {
            return true;
        } else if ((formType.value === 'EL' && !isLegPersonPhoneValid.value) && !company.value)  {
            return true;
        } else {
            return false;
        }
    }

    watch(clientName, (value) => {
        isClientNameValid.value = (value && value.length > 0);
    });

    watch(tax_number, (value) => {
        is_tax_number_valid.value = (value && value.toString().length === 9);
    });

    watch(legPearsonTax, (value) => {
        legPearsonTaxValid.value = (value && value.length > 0);
    });

    watch(legPearson, (value) => {
        isLegPersonValid.value = (value && value.length > 0);
    });

    watch(legPersonPhone, (value) => {
        isLegPersonPhoneValid.value = (value && value.toString().length === 9);
    });



    const getCompany = async () => {
        loadingLeg.value = true;
        setNotification(undefined);
        setEditable(false);
        clientName.value = undefined;
        tax_number.value = undefined;
        legPearsonTax.value = undefined;
        legPearson.value = undefined;
        legPersonPhone.value = undefined;
        company.value = undefined;
        isLegPersonPhoneValid.value = false;
        isLegPersonValid.value = false;
        legPearsonTaxValid.value = false
        is_tax_number_valid.value = false
        isClientNameValid.value = false


        error.value = null;
        try {
            const response = await fetch(`http://localhost:3000/companies?tax_number=${tax.value}`);
            const data = await response.json();

            if (data[0]?.status === "გაუქმებული"){
                setNotification('აღნიშნული ნომრით კლიენტი გაუქმებულია');
                setEditable(true)
            }else if(data[0]?.status === "დახურული"){
                setNotification("აღნიშნული ნომრით კლიენტი დახურულია")
                setEditable(true);
            }else if(data.length === 0){
                setNotification("აღნიშნული ნომრით კლიენტი არ მოიძებნა")
                setEditable(true);
            }
            else {
                setNotification(null)
                setEditable(false)
                company.value = data[0];
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
        editable,  // Now the editable value is shared
        isValidTax,
        error,
        notification,
        getCompany,
        clientName,
        tax_number,
        legPearsonTax,
        disabledLeg,
        legPersonPhone,

    };
}
