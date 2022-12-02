import fs from 'fs';
import express from 'express';
import { create } from 'ipfs-http-client'
const router: any = express.Router();
import Joi from 'joi';
import dotenv  from "dotenv";
dotenv.config()

const daoInfo = {
  milestoneContract: "0x0000000000000000000000000000000000000000",
  discord: "https://discord.com/invite/VHUZjJ8s",
  email: "https://discord.com/invite/VHUZjJ8s"
}

const schema = Joi.object({
  projectName: Joi.string().required(),
  beneficiaryName: Joi.string().required(),
  title: Joi.string().required(),
  email: Joi.string().required(),
  walletAddress: Joi.string().required()
});

router.post('/create', async (req: any, res: any) => {
  let output = { flag: false, message: '', data: '' };

  let { error, value } = schema.validate(req.body);

  if (error) {
    output.message = error.message;
    return res.status(400).json(output);
  }

  let { projectName, beneficiaryName, title, email, walletAddress } = req.body;

const content: string = `
DAO CONTRIBUTOR AGREEMENT

This DAO Contributor Agreement (the “Agreement”) is entered into between the organization known as Ubeswap DAO (the “DAO”) and the contributor named on the signature page hereto (the “Contributor”) as of ${new Date()} (“Effective Date”). The DAO and the Contributor agree as follows:

1. Services. The Contributor agrees to consult with and provide the following services for the DAO:
[____________];
[____________];
[____________]; and
such other services as may be reasonably be requested by the DAO (collectively, the “Services”).

2. Consideration. As the sole consideration due to the Contributor for the Services, the DAO will provide such stablecoins or other cryptocurrency or assets as the DAO and Contributor shall separately agree (the “Payment”), provided, however, that Contributor acknowledges and agrees that the amount, form and timing of the Payment is subject at all times to modification pursuant to the DAO’s governance framework. In no event shall the DAO be responsible for any fees or other payments to the Contributor except as expressly set forth in this Agreement. The Contributor shall also be entitled to reimbursement for reasonable, documented expenses for which the Contributor receives prior written approval from the DAO.

3. Ownership. The Contributor shall own all intellectual property and related rights throughout the world that arise in whole or part out of, or in connection with, the Services or any Proprietary Information (“Inventions”). Notwithstanding the foregoing, the Contributor shall grant the DAO a free, nonexclusive license to use the Inventions. To the greatest extent possible, each Contributor shall open source all of their work (e.g. via Apache 2.0).

4. Proprietary Information. The Contributor agrees that all Inventions and other business, technical and financial information (including, without limitation, the identity of and information relating to DAO’s members, contributors or grant applicants) the Contributor obtains from or assigns to the DAO, or learns in connection with the Services, constitute “Proprietary Information.” The Contributor will hold in confidence and not disclose or, except in performing the Services or as otherwise permitted by the DAO, use any Proprietary Information. However, the Contributor shall not be so obligated with respect to information that (i) the Contributor can document is or becomes readily publicly available without restriction through no fault of the Contributor, or (ii) that the Contributor knew without restriction prior to its disclosure by the DAO. Upon termination or as otherwise requested by the DAO, the Contributor will promptly return to the DAO all items and copies containing or embodying Proprietary Information. Notwithstanding the foregoing nondisclosure obligations, pursuant to 18 U.S.C. Section 1833(b), the Contributor shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made: (1) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney, and solely for the purpose of reporting or investigating a suspected violation of law; or (2) in a complaint or other document filed in a lawsuit or other proceeding if such filing is made under seal.

5. Termination. Either party may terminate this Agreement at any time, for any reason, by giving the other written notice (including email). Notwithstanding any such termination, Sections 2 through 8 of this Agreement and any remedies for breach of this Agreement shall survive any termination or expiration.

6. Relationship of the Parties; Promotional Rights. Notwithstanding any provision hereof, for all purposes of this Agreement, each party shall be and act as an independent contractor and not as a partner, joint venturer, agent or employee of the other and shall not bind nor attempt to bind the other to any contract. The Contributor shall not be eligible to participate in any of the DAO’s employee benefit plans, fringe benefit programs, group insurance arrangements or similar programs. The DAO may use and authorize the use of the Contributor’s name (as represented to the DAO by the Contributor) in promotional materials, websites and the like. The DAO will confirm in writing with the Contributor should the Contributor’s name be shared “publicly”, publicly defined as available to anybody via the world wide web without any direct sharing or password protections on pages. The Contributor will also follow protocol for online social media posting and sharing that the DAO shares and may update from time to time.

7. No Conflicts; Enforcement of Policies. The Contributor represents and warrants that neither this Agreement nor the performance thereof will conflict with or violate any obligation of the Contributor or right of any third party. [The Contributor acknowledges and agrees that all members of and contributors to this DAO are responsible for ensuring that every other member and contributor follows the DAO’s Code of Conduct (the “Code”), as available on the DAO’s [Notion] page and previously made available to the Contributor. The Contributor agrees that if they witness a violation of the Code, they will report it to an administrator or similar authority designated by the DAO, which may include a registry or other protocol for automating disclosures and dispute resolution ("Administrators"). The Contributor further acknowledges that if they do not follow the Code, the Administrators may edit the Contributor’s posts and remove them from the DAO and/or the DAO’s online coordination systems. Whether to take any enforcement action is in the complete discretion of the Administrators. ] The Contributor also represents and warrants that neither they nor (if an entity), to the best of its knowledge and belief after due inquiry, any of its beneficial owners, nor any person or entity controlled by, controlling or under common control with the Contributor or its beneficial owners or related persons is included in any list described on Appendix A to this Agreement.

8. Waiver of Claims; Limitation of Liability. Notwithstanding anything to the contrary in this Agreement, each party (the “Indemnifying Party”) shall indemnify the other party and such other party’s affiliates (each such person an “Indemnified Party”), against, and hold them harmless from, any loss, liability, claim, damage or expense (including reasonable legal fees and expenses) suffered or incurred by any such Indemnified Party arising from or relating to any failure by the Indemnifying Party to comply with any applicable agreement or obligation under this Agreement or the breach of any representation or warranty given herein. In addition, the Contributor acknowledges and agrees that it shall not directly or indirectly take any action against a DAO member or contributor under a general partnership theory of liability.

9. Notice. All notices shall be in writing and delivered electronically:

If to the DAO:
${daoInfo.email}
If to the Contributor:
${email}

The parties agree that all communication made from each of the above email addresses can be relied upon by the recipient party as the conclusive, binding communication by the party sending such communication using such email address.
Miscellaneous. This Agreement and the Services performed hereunder are personal to the Contributor and the Contributor shall not have the right or ability to assign, transfer or subcontract any obligations under this Agreement without the written consent of the DAO. Any attempt to do so shall make the Agreement void. The DAO shall be free to transfer any of its rights under this Agreement to a third party. Any breach of Sections 3 or 4 will cause irreparable harm to the DAO for which damages would not be an adequate remedy, and therefore, the DAO shall be entitled to injunctive relief with respect thereto in addition to any other remedies. This is the entire agreement between the parties with respect to the subject matter hereof and no changes or modifications or waivers to this Agreement shall be effective unless in writing and signed by both parties. This Agreement may be executed in two or more counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Counterparts may be delivered via facsimile, electronic mail (including pdf or any electronic signature complying with the U.S. federal ESIGN Act of 2000, Uniform Electronic Transactions Act or other applicable law) or other transmission method and any counterpart so delivered shall be deemed to have been duly and validly delivered and be valid and effective for all purposes. In the event that any provision of this Agreement is determined to be illegal or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware without regard to the conflicts of law provisions thereof. In any action or proceeding to enforce rights under this Agreement, the prevailing party shall be entitled to recover costs and attorneys’ fees. 
[Remainder of page intentionally left blank]
The undersigned have executed this DAO Contributor Agreement as of the Effective Date.
DAO:
** Name:** Ubeswap DAO
** Wallet address:** ${daoInfo.milestoneContract}
** Email:** ${daoInfo.email}
** Discord Username:** ${daoInfo.discord}
CONTRIBUTOR:
** By:** ${beneficiaryName}
** Name:** ${projectName}
** Title:** ${title}
** Email:** ${email}
** [Chain Used for Payments] Wallet Address:** ${walletAddress}

APPENDIX A
A person or entity whose name appears on (i) the List of Specially Designated Nationals and Blocked Persons maintained by the U.S. Office of Foreign Assets Control; (ii) other lists of prohibited persons and entities as may be mandated by applicable law or regulation; or (iii) such other lists of prohibited persons and entities as may be provided to the Fund in connection therewith;
A Senior Foreign Political Figure (a), any member of a Senior Foreign Political Figure’s “immediate family,” which includes the figure’s parents, siblings, spouse, children and in-laws, or any Close Associate of a Senior Foreign Political Figure (b), or a person or entity resident in, or organized or chartered under, the laws of a Non-Cooperative Jurisdiction (c);
A person or entity resident in, or organized or chartered under, the laws of a jurisdiction that has been designated by the U.S. Secretary of the Treasury under Section 311 or 312 of the USA PATRIOT Act as warranting special measures due to money laundering concerns; or
A person or entity who gives the Contributor reason to believe that its funds originate from, or will be or have been routed through, an account maintained at a Foreign Shell Bank (d), an “offshore bank,” or a bank organized or chartered under the laws of a Non-Cooperative Jurisdiction.
(a) "Senior Political Figure" means a senior official in the executive, legislative, administrative, military or judicial branches of a foreign government (whether elected or not), a senior official of a major foreign political party, or a senior executive of a foreign government-owned corporation. In addition, a Senior Foreign Political Figure includes any corporation, business or other entity that has been formed by, or for the benefit of, a Senior Foreign Political Figure.
(b) "Close Associate of a Senior Foreign Political Figure" means a person who is widely and publicly known internationally to maintain an unusually close relationship with the Senior Foreign Political Figure, and includes a person who is in a position to conduct substantial domestic and international financial transactions on behalf of the Senior Foreign Political Figure.
(c) “Non-Cooperative Jurisdiction” means any foreign country that has been designated as non-cooperative with international anti-money laundering principles or procedures by an intergovernmental group or organization, such as the Financial Task Force on Money Laundering, of which the U.S. is a member and with which designation the U.S. representative to the group or organization continues to concur.
(d) “Foreign Shell Bank” means a Foreign Bank without a Physical Presence in any country, but does not include a Regulated Affiliate.
A “Foreign Bank” means an organization that (i) is organized under the laws of a foreign country, (ii) engages in the business of banking, (iii) is recognized as a bank by the bank supervisory or monetary authority of the country of its organization or principal banking operations, (iv) receives deposits to a substantial extent in the regular course of its business, and (v) has the power to accept demand deposits, but does not include the U.S. branches or agencies of a foreign bank.
“Physical Presence” means a place of business that is maintained by a Foreign Bank and is located at a fixed address, other than solely a post office box or an electronic address, in a country in which the Foreign Bank is authorized to conduct banking activities, at which location the Foreign Bank (i) employs one or more individuals on a full-time basis, (ii) maintains operating records related to its banking activities, and (iii) is subject to inspection by the banking authority that licensed the Foreign Bank to conduct banking activities.
“Regulated Affiliate” means a Foreign Shell Bank that is an affiliate of a depository institution, credit union or Foreign Bank that maintains a Physical Presence in the U.S. or a foreign country regulating such affiliated depository institution, credit union or Foreign Bank.
`;

  //pin image

  fs.writeFileSync("./uploads/file.txt", content.trim());

  const readable = fs.readFileSync("./uploads/file.txt", "utf-8");

  // const client = create({
  //   host: 'ipfs.infura.io',
  //   port: 5001,
  //   protocol: 'https',
  //   headers: {
  //     authorization:
  //       'Basic ' +
  //       Buffer.from(
  //         process.env.IPFS_ID + ':' + process.env.IPFS_SECRET
  //       ).toString('base64')
  //   }
  // });

  // try {
  //   let pinFile = await client.add(readable, {
  //     cidVersion: 0
  //   });

  //   //build json
  //   let pinJson = await client.add(
  //     JSON.stringify({
  //       name: projectName,
  //       description: `Ubeswap DAO Contributor Agreement for ${projectName}`,
  //       document: `ipfs://${pinFile.path}`
  //     }),
  //     {
  //       cidVersion: 0
  //     }
  //   );

  //   output.flag = true;
  //   output.message = 'NFT asset uploaded successfully';
  //   output.data = `ipfs://${pinJson.path}`;

  //   fs.unlinkSync("./uploads/file.txt");
  //   return res.status(200).json(output);
  // } catch (e: any) {
  //   fs.unlinkSync("./uploads/file.txt");
  //   output.message = e.message;
  //   return res.status(400).json(output);
  // }
});

export {express,router};
