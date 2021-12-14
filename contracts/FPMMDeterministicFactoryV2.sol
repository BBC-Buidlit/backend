pragma solidity ^0.5.1;

import {IERC20} from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {ConditionalTokens} from "@gnosis.pm/conditional-tokens-contracts/contracts/ConditionalTokens.sol";
import {CTHelpers} from "@gnosis.pm/conditional-tokens-contracts/contracts/CTHelpers.sol";
import {Create2CloneFactory} from "./Create2CloneFactory.sol";
import {FixedProductMarketMakerV2, FixedProductMarketMakerData} from "./FixedProductMarketMakerV2.sol";
import {ERC1155TokenReceiver} from "@gnosis.pm/conditional-tokens-contracts/contracts/ERC1155/ERC1155TokenReceiver.sol";
import {ERC20} from "./ERC20.sol";

contract FPMMDeterministicFactoryV2 is
    Create2CloneFactory,
    FixedProductMarketMakerData,
    ERC1155TokenReceiver
{
    using SafeMath for uint256;

    event FixedProductMarketMakerCreation(
        address indexed creator,
        FixedProductMarketMakerV2 fixedProductMarketMaker,
        ConditionalTokens conditionalTokens,
        IERC20 collateralToken,
        bytes32[] conditionIds,
        uint256 fee
    );

    FixedProductMarketMakerV2 public implementationMaster;
    address internal currentFunder;
    uint8 public protocolFeeDenominator;
    bool public protocolFeeOn;
    address public protocolFeeSetter;

    constructor() public {
        implementationMaster = new FixedProductMarketMakerV2();
        protocolFeeSetter = msg.sender;
    }

    function cloneConstructor(bytes calldata consData) external {
        (
            ConditionalTokens _conditionalTokens,
            IERC20 _collateralToken,
            bytes32[] memory _conditionIds,
            uint256 _fee,
            address _factoryAddress
        ) = abi.decode(
                consData,
                (ConditionalTokens, IERC20, bytes32[], uint256, address)
            );

        _supportedInterfaces[_INTERFACE_ID_ERC165] = true;
        _supportedInterfaces[
            ERC1155TokenReceiver(0).onERC1155Received.selector ^
                ERC1155TokenReceiver(0).onERC1155BatchReceived.selector
        ] = true;

        conditionalTokens = _conditionalTokens;
        collateralToken = _collateralToken;
        conditionIds = _conditionIds;
        fee = _fee;
        factoryAddress = _factoryAddress;

        uint256 atomicOutcomeSlotCount = 1;
        outcomeSlotCounts = new uint256[](conditionIds.length);
        for (uint256 i = 0; i < conditionIds.length; i++) {
            uint256 outcomeSlotCount = conditionalTokens.getOutcomeSlotCount(
                conditionIds[i]
            );
            atomicOutcomeSlotCount *= outcomeSlotCount;
            outcomeSlotCounts[i] = outcomeSlotCount;
        }
        require(atomicOutcomeSlotCount > 1, "conditions must be valid");

        collectionIds = new bytes32[][](conditionIds.length);
        _recordCollectionIDsForAllConditions(conditionIds.length, bytes32(0));
        require(
            positionIds.length == atomicOutcomeSlotCount,
            "position IDs construction failed!?"
        );
    }

    function _recordCollectionIDsForAllConditions(
        uint256 conditionsLeft,
        bytes32 parentCollectionId
    ) private {
        if (conditionsLeft == 0) {
            positionIds.push(
                CTHelpers.getPositionId(collateralToken, parentCollectionId)
            );
            return;
        }

        conditionsLeft--;

        uint256 outcomeSlotCount = outcomeSlotCounts[conditionsLeft];

        collectionIds[conditionsLeft].push(parentCollectionId);
        for (uint256 i = 0; i < outcomeSlotCount; i++) {
            _recordCollectionIDsForAllConditions(
                conditionsLeft,
                CTHelpers.getCollectionId(
                    parentCollectionId,
                    conditionIds[conditionsLeft],
                    1 << i
                )
            );
        }
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        ConditionalTokens(msg.sender).safeTransferFrom(
            address(this),
            currentFunder,
            id,
            value,
            data
        );
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {
        ConditionalTokens(msg.sender).safeBatchTransferFrom(
            address(this),
            currentFunder,
            ids,
            values,
            data
        );
        return this.onERC1155BatchReceived.selector;
    }

    function create2FixedProductMarketMaker(
        uint256 saltNonce,
        ConditionalTokens conditionalTokens,
        IERC20 collateralToken,
        bytes32[] calldata conditionIds,
        uint256 fee,
        uint256 initialFunds,
        uint256[] calldata distributionHint
    ) external returns (FixedProductMarketMakerV2) {
        FixedProductMarketMakerV2 fixedProductMarketMaker = FixedProductMarketMakerV2(
                create2Clone(
                    address(implementationMaster),
                    saltNonce,
                    abi.encode(
                        conditionalTokens,
                        collateralToken,
                        conditionIds,
                        fee,
                        address(this)
                    )
                )
            );
        emit FixedProductMarketMakerCreation(
            msg.sender,
            fixedProductMarketMaker,
            conditionalTokens,
            collateralToken,
            conditionIds,
            fee
        );

        if (initialFunds > 0) {
            currentFunder = msg.sender;
            collateralToken.transferFrom(
                msg.sender,
                address(this),
                initialFunds
            );
            collateralToken.approve(
                address(fixedProductMarketMaker),
                initialFunds
            );
            fixedProductMarketMaker.addFunding(initialFunds, distributionHint);
            fixedProductMarketMaker.transfer(
                msg.sender,
                fixedProductMarketMaker.balanceOf(address(this))
            );
            currentFunder = address(0);
        }

        return fixedProductMarketMaker;
    }

    function withdrawProtocolFees(
        address[] calldata _tokens,
        address _recipient
    ) external onlyProtocolFeeSetter {
        for (uint256 i = 0; i < _tokens.length; i++) {
            ERC20 _token = ERC20(_tokens[i]);
            uint256 _tokenBalance = _token.balanceOf(address(this));
            if (_tokenBalance > 0) {
                _token.transfer(_recipient, _tokenBalance);
            }
        }
    }

    function setProtocolFeeOn(bool _protocolFeeOn)
        external
        onlyProtocolFeeSetter
    {
        protocolFeeOn = _protocolFeeOn;
    }

    function setProtocolFeeDenominator(uint8 _protocolFeeDenominator)
        external
        onlyProtocolFeeSetter
    {
        require(_protocolFeeDenominator >= 4, "max 25% protocol fee");
        protocolFeeDenominator = _protocolFeeDenominator;
    }

    function setProtocolFeeSetter(address _protocolFeeSetter)
        external
        onlyProtocolFeeSetter
    {
        require(
            _protocolFeeSetter != address(0),
            "cannot set protocolFeeSetter to zero address"
        );
        protocolFeeSetter = _protocolFeeSetter;
    }

    modifier onlyProtocolFeeSetter() {
        require(msg.sender == protocolFeeSetter, "onlyProtocolFeeSetter");
        _;
    }
}
