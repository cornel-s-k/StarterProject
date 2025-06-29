export default class DetailPresenter {
  #storyId;
  #view;
  #model;
  #dbModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = apiModel;
    this.#dbModel = dbModel;
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

  async #isReportSaved() {
    const report = await this.#dbModel.getReportById(this.#storyId);
    return !!report;
  }

  async showStoryDetail() {
    try {
      const response = await this.#model.getStoryById(this.#storyId);
      if (!response.ok) return;

      const story = response.story;
      this.#view.StoryDetail(story);
      this.#view.initialMap(story.lat, story.lon, story.locationName);
      await this.showSaveButton(); // Panggil yang benar
    } catch (error) {
      console.error("Error fetching story details:", error);
    }
  }

  async saveReport() {
    try {
      const response = await this.#model.getStoryById(this.#storyId);
      if (!response.ok) throw new Error('Gagal mengambil data laporan');

      const story = response.story;
      await this.#dbModel.putReport(story);
      this.#view.saveToBookmarkSuccessfully('Berhasil disimpan ke bookmark!');
    } catch (error) {
      console.error('saveReport: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async deleteReport() {
    try {
      await this.#dbModel.deleteReport(this.#storyId);
    } catch (error) {
      throw new Error('Gagal menghapus laporan');
    }
  }
}
