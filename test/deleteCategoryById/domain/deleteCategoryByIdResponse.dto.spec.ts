import { NewContractResponse } from "../../../src/deleteCategoryById/domain/dto/deleteCategoryByIdResponse.dto";


describe('ConsultPkRequest', () => {
    const facturaActual: NewContractResponse = {
        S_IMSI: '123',
        S_CO_ID: 123,
        S_RESP: 123,
        S_CUSTOMER_ID: 123,
        S_RESP_DESC: '123'
    };
    it('should create a catDTO object', () => {
        expect(facturaActual).toEqual(new NewContractResponse('123', 123, 123, 123, '123'));
    });
});