import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {xml2json} from 'xml-js';
import axios from "axios";
import jwt from "jwt-simple";

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
                const url = `${import.meta.env.VITE_API_BASE_URL}/users`

                const Tag = clientType.value === 'IND' ? 'PIN' : 'TaxpayerId';
                const request_body = `
                        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                            <Header>
                                <RequestHeaders xmlns="http://services.altasoft.ge/common/v1.0">
                                    <ApplicationKey>[string]</ApplicationKey>
                                    <RequestId>[string]</RequestId>
                                </RequestHeaders>
                            </Header>
                            <Body>
                                <ListCustomers xmlns="http://services.altasoft.ge/customers/v1.0">
                                    <Query>
                                        <ControlFlags>Basic</ControlFlags>
                                        <Id>851375</Id>
                                        <${Tag}>${personalOrTaxNumber.value}</${Tag}>
                                    </Query>
                                </ListCustomers>
                            </Body>
                        </Envelope>
                    `;
                const response = await axios.post(url, request_body, {
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                });
                const data = JSON.parse(xml2json(response.data, {compact: true, spaces: 4}));
                console.log(data)


                // const customer = data[0];
                const customer = data["Envelope"]["Body"]["ListCustomersResponse"]["Result"]["Customer"]
                console.log(customer)

                if (customer["Status"]["_text"] === 'Cancelled') {
                    notification.value = 'აღნიშნული ნომრით კლიენტი გაუქმებულია.';
                    editable.value = true;
                } else if (customer["Status"]["_text"] === 'Closed') {
                    notification.value = 'აღნიშნული ნომრით კლიენტი დახურულია.';
                    editable.value = true;
                } else {
                    if (clientType.value === 'IND') {
                        user.value = {
                            name: customer['Entity']['Name']['FirstName']['ValueGeo']['_text'],
                            surname: customer['Entity']['Name']['LastName']['ValueGeo']['_text'],
                            personalNumber: customer['Entity']['PIN']['_text'],
                            phoneNumber: undefined,
                        }
                    } else {
                        user.value = {
                            clientName: customer['Name']['ValueGeo']['_text'],
                            taxNumber: customer['TaxDetails']['TaxpayerId']['_text'],
                            legPerson: undefined,
                            legPersonTax: undefined,
                            phoneNumber: undefined
                        }
                    }
                    console.log(user.value)
                }

            } catch (error) {
                if (error.status === 404) {
                    notification.value = 'აღნიშნული ნომრით კლიენტი არ მოიძებნა.';
                    editable.value = true;
                } else {
                    notification.value = 'სერვერზე დაფიქსირდა შეცდომა.'
                }
                console.error(error)
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
        const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
        console.log(SECRET_KEY)
        const token = jwt.encode({ user: 'example' }, SECRET_KEY);
        console.log(token)
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

    const isChecked = ref(false);
    const handleClick = () => {
        if (formType.value === 'EL' && clientType.value === 'IND') {
            // ესემესის გაგზავნა
            success.value = 'თანხმობის ფორმა გაიგზავნა წარმატებით'
        } else {
            // ბეჭდვა
            success.value = 'თანხმობის ფორმა დაიბეჭდა წარმატებით'
        }
    };

    const router = useRouter();

    const acceptForm = () => {
        if (isChecked.value === true) {
            console.log("yes")
            router.push('/confirm-sms');
        }
    }
    const isContinueEnabled = computed(() => code.value.every(digit => digit !== ''));
    const code = ref(['', '', '', '']);

    const continueAction = () => {
        if (isContinueEnabled.value) {
            console.log('დადასტურება button pressed.');
        }
    };
    const isResendEnabled = ref(false);
    const resendCode = () => {
        if (isResendEnabled.value) {
            startCountdown();
            // Add logic here to resend the verification code if necessary
            console.log('Resending code...');
        }
    };
    const countdown = ref(60);

    const startCountdown = () => {
        countdown.value = 60;
        isResendEnabled.value = false;
        const interval = setInterval(() => {
            countdown.value--;
            if (countdown.value === 0) {
                clearInterval(interval);
                isResendEnabled.value = true;
            }
        }, 1000);
    };
    return {
        countdown,
        startCountdown,
        resendCode,
        isResendEnabled,
        code,
        isContinueEnabled,
        continueAction,
        formType,
        isChecked,
        acceptForm,
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
