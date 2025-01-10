import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {xml2json} from 'xml-js';
import axios from "axios";

export default function useUser() {
    const router = useRouter();

    const smsError = ref('');
    const otpError = ref('');

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
                const url = `${import.meta.env.VITE_API_BASE_URL}users`

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


                const customer = data["Envelope"]["Body"]["ListCustomersResponse"]["Result"]["Customer"]
                // console.log(data)
                // console.log(customer)

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
                            phoneNumber: customer['ContactInfo']['SMSPhone']['_text'],
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
        if (clientType.value === 'IND') {
            if (editable.value) {
                const user = newUser.value;
                if (formType.value === 'MT') {
                    return !user.name || !user.surname || !user.personalNumber
                } else {
                    return !user.name || !user.surname || !user.personalNumber || !user.phoneNumber
                }
            } else {
                return !user.value
            }
        } else {
            const _user = _newUser.value;
            if (editable.value) {
                if (formType.value === 'MT') {
                    return !_user.clientName || !_user.taxNumber || !_user.legPerson || !_user.legPersonTax
                } else {
                    return !_user.clientName || !_user.taxNumber || !_user.legPerson || !_user.legPersonTax || !_user.phoneNumber;
                }
            } else {
                if (formType.value === 'MT') {
                    return !user.value || !_user.legPerson || !_user.legPersonTax
                } else {
                    return !user.value || !_user.legPerson || !_user.legPersonTax || !_user.phoneNumber;
                }
            }
        }
    })

    const formLang = ref('GE');
    const selectFormType = ref('CF_CB_REC');
    const selectFormTypeLeg = ref('CF_CB_REC');
    const selectFormTypes = {
        'CF_CB_REC': [
            '• თანხმობა მონაცემების დამუშავების თაობაზე (30 დღე)',
            '• თანხმობა მონაცემების დამუშავების თაობაზე (გზავნილები) (30 დღე)'
        ],
        'CF_CB_SEN': ['• თანხმობა მონაცემების საკრედიტო ბიუროსთვის მიწოდების შესახებ'],
        'CF_RS_REC': ['• თანხმობის ფორმა შემოსავლების სამსახურიდან ინფორმაციის გამოთხოვის შესახებ']
    };
    const selectFormTypesLeg = {
        'CF_CB_REC': [
            '• თანხმობა მონაცემების დამუშავების თაობაზე (60 დღე)',
            '• თანხმობა მონაცემების დამუშავების თაობაზე (გზავნილები) (30 დღე)'
        ],
        'CF_CB_SEN': ['• თანხმობა მონაცემების საკრედიტო ბიუროსთვის მიწოდების შესახებ']
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
        if (formType.value === 'EL') {
            // ესემესის გაგზავნა
            const data = {
                lang: formLang.value,
            }

            if (clientType.value === 'IND') {
                data["fullName"] = `${user.value ? user.value.name : newUser.value.name} ${user.value ? user.value.surname : newUser.value.surname}`;
                data["idNumber"] = user.value ? user.value.personalNumber : newUser.value.personalNumber;
                data["consentForm"] = selectFormType.value.split("_")[1];
                data["phoneNum"] = user.value ? user.value.phoneNumber : newUser.value.phoneNumber;

                for (let i = 0; i < _selectFormType.value.length; i++) {
                    try {
                        axios.post(`${import.meta.env.VITE_API_BASE_URL}generate-link`, {}, {params: data});
                    } catch (e) {
                        console.log('Error generating IND consent link(s): ', e);
                    }
                }
                success.value = 'თანხმობის ფორმა გაიგზავნა წარმატებით'
            } else if (clientType.value === 'LEG') {
                data["fullName"] = user.value ? user.value.clientName : _newUser.value.clientName;
                data["idNumber"] = user.value ? user.value.taxNumber : _newUser.value.taxNumber;
                data["consentForm"] = selectFormTypeLeg.value.split("_")[1];
                data["phoneNum"] = user.value ? user.value.phoneNumber : _newUser.value.phoneNumber;

                for (let i = 0; i < _selectFormTypeLeg?.value.length; i++) {
                    try {
                        axios.post(`${import.meta.env.VITE_API_BASE_URL}generate-link`, {}, {params: data})
                    } catch (e) {
                        console.log('Error generating LEG consent link(s): ', e);
                    }
                }

                success.value = 'თანხმობის ფორმა გაიგზავნა წარმატებით'
            }
        } else if (formType.value === 'MT') {
            // ბეჭდვა
            const ReceiptDate = new Date();
            const Deadline = 30; // შესაცვლელია
            const ValidityDate = new Date(ReceiptDate);
            ValidityDate.setDate(ValidityDate.getDate() + 30);

            let data = {
                FormType: formType.value,
                SessionID: 1000001, // შესაცვლელია
                TemplateID: 1, // შესაცვლელია
                ClientType: clientType.value,
                ReceiptDate: ReceiptDate.toISOString(),
                Deadline: Deadline,
                ValidityDate: ReceiptDate.toISOString(),
                Status: "აქტიური", // ნაგულისხმევი
                WithdrawalDate: new Date(), // კითხვა
                Comment: "კლიენტის მოთხოვნით", // nullable
            }
            if (clientType.value === 'IND') {
                data["ClientName"] = `${user.value ? user.value.name : newUser.value.name} ${user.value ? user.value.surname : newUser.value.surname}`;
                data["IDNumber"] = user.value ? user.value.personalNumber : newUser.value.personalNumber;
                data["AuthorizedName"] = "";
                data["AuthorizedIDNumber"] = "";
                data["TemplateCode"] = selectFormType.value;

                for (let i = 0; i < _selectFormType.value.length; i++) {
                    data["Name"] = _selectFormType.value[i];
                    try {
                        axios.post(`${import.meta.env.VITE_API_BASE_URL}consent-form`, data);
                    } catch (e) {
                        console.log('Error adding IND consent form(s): ', e);
                    }
                }
            } else if (clientType.value === 'LEG') {
                data["ClientName"] = user.value ? user.value.clientName : _newUser.value.clientName;
                data["IDNumber"] = user.value ? user.value.taxNumber : _newUser.value.taxNumber;
                data["AuthorizedName"] = user.value ? user.value.legPerson : _newUser.value.legPerson;
                data["AuthorizedIDNumber"] = user.value ? user.value.legPersonTax : _newUser.value.legPersonTax;
                data["TemplateCode"] = selectFormTypeLeg.value;

                for (let i = 0; i < _selectFormTypeLeg.value.length; i++) {
                    data["Name"] = _selectFormTypeLeg.value[i];
                    try {
                        axios.post(`${import.meta.env.VITE_API_BASE_URL}consent-form`, data);
                    } catch (e) {
                        console.log('Error adding LEG consent form(s): ', e);
                    }
                }
            }
            success.value = 'თანხმობის ფორმა დაიბეჭდა წარმატებით'
        }
    };

    const userIp = ref()

    const getUserIp = async () => {
        try {
            const response = await axios.get("https://api.ipify.org");
            userIp.value = response.data;

        } catch (err) {
            console.log(err);
        }
    };
    const verifySms = async () => {
        await getUserIp()
        let userData = {
            "SessionID": 523352523,
            "SenderID": 23535253,
            "MobileNumber": visitLinkResponse?.value.phone,
            "SentTemplateID": 333,
            "TemplateCode": clientType.value === "IND" ? selectFormType.value : selectFormTypeLeg.value,
            "SenderIP": userIp.value,
            "relID": visitLinkResponse?.value.rel_id,
            "IDNumber": visitLinkResponse?.value.idNum
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}sms-verifications`, {
                userData
            }, {

                headers: {
                    "ngrok-skip-browser-warning": "69420"
                },

            });

            console.log(response)

        } catch (error) {
            smsError.value = 'სერვერზე დაფიქსირდა შეცდომა!'
            console.error('Error visiting link:', error.status);
        }
    };

    const acceptForm = async (uuid) => {
        if (isChecked.value === true) {
            await verifySms()
            console.log("yes")
            if (!smsError.value) {
                await router.push('/confirm-sms/' + uuid);
            }
        }
    }
    const isContinueEnabled = computed(() => code.value.every(digit => digit !== ''));
    const code = ref(['', '', '', '']);

    const continueAction = async (uuid) => {
        if (isContinueEnabled.value) {
            console.log('დადასტურება button pressed.');
        }

        try {
            otpError.value = '';
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}verify-otp`, {
                otp: code.value.join(''),
                token: uuid
            });
            router.push('/success');
        } catch (e) {
            otpError.value = 'თქვენ მიერ შეყვანილი კოდი არასწორია!'
            console.log("Error while verifying opt: ", e);
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
    const failed = ref(false)
    const visitLinkResponse = ref()
    const visitLink = async (uuid) => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}visit-link/${uuid}`, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });

            visitLinkResponse.value = response.data

            failed.value = false
        } catch (error) {
            failed.value = true
            console.error('Error visiting link:', error.status);
        }

    };


    return {
        verifySms,
        visitLinkResponse,
        failed,
        visitLink,
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
        success,
        otpError,
        smsError
    };
}
