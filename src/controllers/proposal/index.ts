import { Request, Response, Router } from "express";
import BackendError from "../../exceptions/backend_error";
import { IProposal } from "../../models/IProposal";
import ProposalService from "../../service/proposal_service";

const router = Router();

const proposalService = new ProposalService();

const ProposalController = router.get(
  "",
  async (
    req: Request<unknown, unknown, unknown, { id: string; from: string }>,
    res: Response
  ) => {
    try {
      let proposals: IProposal[] = [];
      const { id, from } = req.query;

      if (from == "server") {
        proposals = await proposalService.getByServer(id);
      } else if (from == "user") {
        proposals = await proposalService.getByUser(id);
      }
      return res.json({ proposals });
    } catch (err) {
      if (err instanceof BackendError) {
        return res
          .status(err.httpStatusCode)
          .json({ message: `${err.name}: ${err.message}` });
      }
    }
  }
);

export default ProposalController;
