import EntityNotFound from "../exceptions/entity_not_found";
import proposalModel, { IProposal } from "../models/IProposal";

class ProposalService {
  /**
   *
   * @param userId
   * @returns Promise<IProposal[]>
   */
  async getByUser(userId: string): Promise<IProposal[]> {
    const proposal = await proposalModel.find({ user_id: userId });
    if (!proposal)
      throw new EntityNotFound(
        `Proposal of user_id : ${userId} not found`,
        "proposal"
      );
    return proposal;
  }

  /**
   *
   * @param serverId
   * @returns Promise<IProposal[]>
   */
  async getByServer(serverId: string): Promise<IProposal[]> {
    const proposal = await proposalModel.find({ server_id: serverId });
    if (!proposal)
      throw new EntityNotFound(
        `Proposal of user_id : ${serverId} not found`,
        "proposal"
      );
    return proposal;
  }

  /**
   *
   * @param id
   * @returns Promise<IProposal>
   */
  async getById(id: string): Promise<IProposal> {
    const proposal = await proposalModel.findById(id);
    if (!proposal)
      throw new EntityNotFound(`Proposal id ${id} not found`, "Proposal");
    return proposal;
  }

  /**
   * @TODO : This needs to be implemented @lakshyabatman
   */
  async addOne() {
    // we can make on chain call over here
  }

  /**
   * @TODO : This needs to be implemented @lakshyabatman
   */
  async resolveById() {}
}

export default ProposalService;
