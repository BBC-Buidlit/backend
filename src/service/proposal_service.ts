import EntityNotFound from "../exceptions/entity_not_found";
import proposalModel, { IProposal } from "../models/IProposal";

class ProposalService {
  async getByUser(userId: string): Promise<IProposal[]> {
    const proposal = await proposalModel.find({ user_id: userId });
    if (!proposal)
      throw new EntityNotFound(
        `Proposal of user_id : ${userId} not found`,
        "proposal"
      );
    return proposal;
  }

  async getByServer(serverId: string): Promise<IProposal[]> {
    const proposal = await proposalModel.find({ server_id: serverId });
    if (!proposal)
      throw new EntityNotFound(
        `Proposal of user_id : ${serverId} not found`,
        "proposal"
      );
    return proposal;
  }

  async getById(id: string) {
    const proposal = await proposalModel.findById(id);
    if (!proposal)
      throw new EntityNotFound(`Proposal id ${id} not found`, "Proposal");
    return proposal;
  }

  async addOne() {
    // we can make on chain call over here
  }

  async resolveById() {}
}

export default ProposalService;
