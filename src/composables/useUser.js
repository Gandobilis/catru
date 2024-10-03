import {ref, watch} from "vue";

export default function useUser() {
    const user = ref();
    const loading = ref(false);
    const editable = ref(false)
    const nameSurname = ref()
    const isNameSurnameValid = ref(false)
    const _personalNumber = ref()
    const isPersonalNumberValid = ref(false)
    const disabled = () => {
        return (!isNameSurnameValid.value || !isPersonalNumberValid.value) && !user.value
    }

    const formType = ref('MT');
    const clientType = ref('IND');
    const personalNumber = ref();
    const notification = ref();
    const formLang = ref('GE')
    const selectFormType = ref('CB-REC')
    const selectFormTypes = {
        'CB-REC': [
            '- თანხმობა მონაცემების დამუშავების თაობაზე (30 დღე)',
            '- თანხმობა მონაცემების დამუშავების თაობაზე (გზავნილები) (30 დღე)'
        ],
        'CB-SEN': ['- თანხმობა მონაცემების საკრედიტო ბიუროსთვის მიწოდების შესახებ'],
        'RS-REC': ['- თანხმობის ფორმა შემოსავლების სამსახურიდან ინფორმაციის გამოთხოვის შესახებ']
    }
    const _selectFormType = ref(selectFormTypes[selectFormType.value])

    watch(selectFormType, (value) => {
        _selectFormType.value = selectFormTypes[value];
    })

    watch(nameSurname, (value) => {
        isNameSurnameValid.value = (value && value.length > 0)
    })

    watch(_personalNumber, (value) => {
        isPersonalNumberValid.value = (value && value.toString().length === 11)
    })

    const getUser = async () => {
        loading.value = true;
        notification.value = undefined;
        editable.value = false;
        nameSurname.value = undefined;
        _personalNumber.value = undefined;
        isNameSurnameValid.value = false;
        isPersonalNumberValid.value = false;
        user.value = undefined;

        if (personalNumber.value) {
            try {
                const response = await fetch(`http://localhost:3000/users?personal_number=${personalNumber.value}`);
                const data = await response.json();

                if (data.length > 0) {
                    const _user = data[0];
                    if (_user.status === 'გაუქმებული') {
                        notification.value = 'აღნიშნული ნომრით კლიენტი გაუქმებულია.'
                        editable.value = true;
                    } else if (_user.status === 'დახურული') {
                        notification.value = 'აღნიშნული ნომრით კლიენტი დახურულია.'
                        editable.value = true;
                    } else {
                        user.value = {
                            nameSurname: `${_user.name} ${_user.surname}`,
                            personalNumber: _user.personal_number,
                        };
                    }
                } else {
                    notification.value = 'აღნიშნული ნომრით კლიენტი არ მოიძებნა.'
                    editable.value = true;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                loading.value = false;
            }
        } else {
            loading.value = false;
            notification.value = 'გთხოვთ შეავსოთ კლიენტის/პირადი ნომრის ველი'
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
        getUser
    };
}
