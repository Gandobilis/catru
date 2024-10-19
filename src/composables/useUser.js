import { ref, watch } from "vue";
import useNotification from './useNotification';
import {fa} from "@faker-js/faker"; // Import shared notification and editable state

export default function useUser() {
    const { notification, setNotification, editable, setEditable, formType  } = useNotification(); // Access shared state

    const user = ref();
    const loading = ref(false);
    const nameSurname = ref();
    const isNameSurnameValid = ref(false);
    const _personalNumber = ref();
    const _phone_number = ref()
    const isPersonalNumberValid = ref(false);
    const isPhoneNumberValid = ref(false)
    const clientType = ref('IND');
    function disabled() {
        if ((!isNameSurnameValid.value || !isPersonalNumberValid.value) && !user.value) {
            return true;
        } else return (formType.value === 'EL' && !isPhoneNumberValid.value) && !user.value;
    }
    const personalNumber = ref();
    const formLang = ref('GE');
    const selectFormType = ref('CB-REC');
    const selectFormTypeLeg = ref('CB-REC');
    const selectFormTypes = {
        'CB-REC': [
            '• თანხმობა მონაცემების დამუშავების თაობაზე (30 დღე)',
            '• თანხმობა მონაცემების დამუშავების თაობაზე (გზავნილები) (30 დღე)'
        ],
        'CB-SEN': ['• თანხმობა მონაცემების საკრედიტო ბიუროსთვის მიწოდების შესახებ'],
        'RS-REC': ['• თანხმობის ფორმა შემოსავლების სამსახურიდან ინფორმაციის გამოთხოვის შესახებ']
    };
    const selectFormTypesLeg = {
        'CB-REC': [
            '• თანხმობა მონაცემების დამუშავების თაობაზე (60 დღე)',
            '• თანხმობა მონაცემების დამუშავების თაობაზე (გზავნილები) (30 დღე)'
        ],
        'CB-SEN': ['• თანხმობა მონაცემების საკრედიტო ბიუროსთვის მიწოდების შესახებ']
    };
    const _selectFormType = ref(selectFormTypes[selectFormType.value]);
    const _selectFormTypeLeg = ref(selectFormTypesLeg[selectFormTypeLeg.value]);


    watch(selectFormType, (value) => {
        _selectFormType.value = selectFormTypes[value];
    });

    watch(selectFormTypeLeg, (value) => {
        _selectFormTypeLeg.value = selectFormTypesLeg[value];
    });
    watch(nameSurname, (value) => {
        isNameSurnameValid.value = (value && value.length > 0);
    });

    watch(_personalNumber, (value) => {
        isPersonalNumberValid.value = (value && value.toString().length === 11);
    });

    watch(_phone_number, (value) => {
        isPhoneNumberValid.value = (value && value.toString().length === 9);
    });

    const clearFields = () =>{
        user.value = null
    }
    const sendSms = async () => {
        setNotification("თანხმობის ფორმა წარმატებით გაიგზავნა")
        clearFields()
    }



    const getUser = async () => {
        loading.value = true;
        setNotification(undefined);
        setEditable(false);
        nameSurname.value = undefined;
        _personalNumber.value = undefined;
        isNameSurnameValid.value = false;
        isPhoneNumberValid.value = false;
        isPersonalNumberValid.value = false;
        user.value = undefined;

        if (personalNumber.value) {
            try {
                const response = await fetch(`http://localhost:3000/users?personal_number=${personalNumber.value}`);
                const data = await response.json();

                if (data.length > 0) {

                    const _user = data[0];
                    if (_user.status === 'გაუქმებული') {
                        setNotification('აღნიშნული ნომრით კლიენტი გაუქმებულია.');
                        setEditable(true);
                    } else if (_user.status === 'დახურული') {
                        setNotification('აღნიშნული ნომრით კლიენტი დახურულია.');
                        setEditable(true);
                    } else {
                        user.value = {
                            name: _user.name,
                            surname: _user.surname,
                            nameSurname: `${_user.name} ${_user.surname}`,
                            personalNumber: _user.personal_number,
                            phone_number: _user.phone_number,
                        };
                    }
                } else {
                    setNotification('აღნიშნული ნომრით კლიენტი არ მოიძებნა.');
                    setEditable(true);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                loading.value = false;
            }
        } else {
            loading.value = false;
            setNotification('ეს ველი სავალდებულოა');
        }
    };

    return {
        disabled,
        formType,
        clientType,
        notification,
        personalNumber,
        formLang,
        editable,
        user,
        loading,
        nameSurname,
        _personalNumber,
        isNameSurnameValid,
        isPersonalNumberValid,
        selectFormType,
        _selectFormType,
        _selectFormTypeLeg,
        selectFormTypeLeg,
        _phone_number,
        sendSms,
        getUser
    };
}
