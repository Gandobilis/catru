import {computed, ref, watch} from "vue";

export default function useUser() {
    const formType = ref('MT')
    const clientType = ref('IND');
    watch(clientType, () => {
        if (personalOrTaxNumber.value === personalNumber.value) {
            personalNumber.value = undefined
            newUser.value = {
                name: undefined,
                surname: undefined,
                personalNumber: undefined,
                phoneNumber: undefined,
            }
        } else {
            taxNumber.value = undefined
            _newUser.value = {
                clientName: undefined,
                taxNumber: undefined,
                legPerson: undefined,
                legPersonTax: undefined,
                phoneNumber: undefined
            }
        }
        notification.value = undefined
        editable.value = false
        user.value = undefined
        success.value = undefined
    })

    const personalNumber = ref();
    const taxNumber = ref();
    const personalOrTaxNumber = computed({
        get() {
            return clientType.value === 'IND' ? personalNumber.value : taxNumber.value
        },
        set(value) {
            if (clientType.value === 'IND') {
                personalNumber.value = value
            } else {
                taxNumber.value = value
            }
        }
    })

    const user = ref();
    const loading = ref(false);
    const editable = ref(false);
    const notification = ref();
    const getUser = async () => {
        loading.value = true;
        notification.value = undefined;
        editable.value = undefined;
        user.value = undefined;

        if (personalOrTaxNumber.value) {
            try {
                const response = await fetch(`http://localhost:3000/${clientType.value === 'IND' ? 'users?personal_number' : 'companies?tax_number'}=${personalOrTaxNumber.value}`);
                const data = await response.json();

                if (data.length > 0) {
                    const _user = data[0];
                    if (_user.status === 'გაუქმებული') {
                        notification.value = 'აღნიშნული ნომრით კლიენტი გაუქმებულია.';
                        editable.value = true;
                    } else if (_user.status === 'დახურული') {
                        notification.value = 'აღნიშნული ნომრით კლიენტი დახურულია.';
                        editable.value = true;
                    } else {
                        if (clientType.value === 'IND') {
                            user.value = {
                                name: _user.name,
                                surname: _user.surname,
                                personalNumber: _user.personal_number,
                                phoneNumber: _user.phone_number,
                            }
                        } else {
                            user.value = {
                                clientName: _user.client_name,
                                taxNumber: _user.tax_number,
                                legPerson: _user.leg_person,
                                legPersonTax: _user.leg_person_tax,
                                phoneNumber: _user.phone_number
                            }
                        }
                    }
                } else {
                    notification.value = 'აღნიშნული ნომრით კლიენტი არ მოიძებნა.';
                    editable.value = true;
                }
            } catch (error) {
                notification.value = 'სერვერზე დაფიქსირდა შეცდომა.'
            } finally {
                loading.value = false;
            }
        } else {
            loading.value = false;
            notification.value = 'ეს ველი სავალდებულოა.';
        }
    };


    const newUser = ref({
        name: undefined,
        surname: undefined,
        personalNumber: undefined,
        phoneNumber: undefined,
    })
    const _newUser = ref({
        clientName: undefined,
        taxNumber: undefined,
        legPerson: undefined,
        legPersonTax: undefined,
        phoneNumber: undefined
    })

    const disabled = computed(() => {

    })
    const disabledLeg = computed(() => {

    })

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

    const success = ref()
    const handleClick = () => {
        if (formType.value === 'EL' && clientType.value === 'IND') {
            // ესემესის გაგზავნა
            success.value = 'თანხმობის ფორმა გაიგზავნა წარმატებით'
        } else {
            // ბეჭდვა
            success.value = 'თანხმობის ფორმა დაიბეჭდა წარმატებით'
        }
    };

    return {
        formType,
        clientType,
        personalNumber,
        taxNumber,
        personalOrTaxNumber,
        newUser,
        _newUser,
        formLang,
        user,
        loading,
        selectFormType,
        _selectFormType,
        _selectFormTypeLeg,
        selectFormTypeLeg,
        getUser,
        notification,
        editable,
        handleClick,
        disabled,
        disabledLeg,
        success
    };
}
