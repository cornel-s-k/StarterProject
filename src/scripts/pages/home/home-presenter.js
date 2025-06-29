// home-presenter.js
export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialStory() {
    this.#view.showLoading(); // Show loading spinner

    try {
      const response = await this.#model.getAllReports();
      console.log("initialStory: response:", response);
      if (!response.ok) {
        console.error("initialStory: response:", response);
        this.#view.populateReportsListError(response.message);
        return;
      }

      this.#view.populateReportsList(response.message, response.listStory);
    } catch (error) {
      console.log("initialStory: error:", error);
      this.#view.populateReportsListError(error.message);
    } finally {
      // this.#view.hideLoading(); // Hide loading spinner
    }
  }
}
