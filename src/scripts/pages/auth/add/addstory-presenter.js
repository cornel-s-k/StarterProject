export default class HomePresenter {
    #view;
    #model;
  
    constructor({ view, model }) {
      this.#view = view;
      this.#model = model;
    }
  
    async postNewReport({  description, photo, lat, lon }) {
      this.#view.showSubmitLoadingButton();
      try {
        const data = {
          description: description,
          photo: photo,
          lat: lat,
          lon: lon,
        };
        const response = await this.#model.TambahData(data);
  
        if (!response.ok) {
          console.error('TambahData: response:', response);
          this.#view.storeFailed(response.message);
          return;
        }
  
        this.#view.storeSuccessfully(response.message, response.data);
      } catch (error) {
        console.error('TambahData: error:', error);
        this.#view.storeFailed(error.message);
      } finally {
        this.#view.hideSubmitLoadingButton();
      }
    }

    
  }
  
  