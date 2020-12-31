import React from "react"
import classnames from "classnames"

import ProposalsHeader from "./ProposalsHeader"

import { useFieldArray, useForm } from "react-hook-form"
import { FiMinus, FiPlus } from "react-icons/fi"
import { useWeb3Result } from "../../hooks/useWeb3Result"
import { useContract } from "../../hooks/useContract"
import { useStoreActions } from "../../state/hooks"
import { toUtf8Bytes } from "ethers/lib/utils"

type ProposalValues = {
    description: string
    discoverabilityPeriod: number
    operations: {
        address: string
        value: string
        signature: string
        calldata?: string
    }[]
}

const ProposalForm = () => {
    const { register, control, handleSubmit } = useForm<ProposalValues>({ defaultValues: { operations: [{}] } })
    const { fields: operations, append: addOperation, remove: removeOperation } = useFieldArray({ control, name: "operations" })

    const contract = useContract()
    const maxOperations: number = useWeb3Result(async ({ account, library }) => (await contract.proposalMaxOperations()).toNumber()) || 1

    const addPendingTransaction = useStoreActions(actions => actions.addPendingTransaction)
    ;(window as any).contract = contract
    const onSubmit = async (data: ProposalValues) => {
        addPendingTransaction((await contract.submitProposal(
            data.discoverabilityPeriod,
            data.operations.map(o => o.address),
            data.operations.map(o => o.value),
            data.operations.map(o => o.signature),
            data.operations.map(o => o.calldata ? toUtf8Bytes(o.calldata) : undefined),
            data.description
        )).hash)
    }

    return (
        <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative">
                <div className="absolute pattern-dots-sm text-green-500 text-opacity-50 left-0 top-0 w-8 h-8 -ml-4 -mt-1" />
                <label htmlFor="description" className="mb-2">Description</label>
                <textarea className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" style={{ minHeight: "4rem", maxHeight: "12rem" }} name="description" placeholder="Make the CAP logo pink" ref={register({ required: true })} />
            </div>
            <div className="flex flex-col relative">
                <div className="absolute pattern-dots-sm text-green-500 text-opacity-50 left-0 top-0 w-8 h-8 -ml-4 -mt-1" />
                <label htmlFor="discoverabilityPeriod" className="mb-2 flex flex-row justify-between">
                    <span>Discoverability period (# blocks)</span>
                    <span className="text-gray-800">1 hour ~= 272 blocks</span>
                </label>
                <input className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" name="discoverabilityPeriod" placeholder="100" type="number" ref={register({ required: true })} />
            </div>
            <div className="flex flex-col">
                <div className="mb-2 flex flex-row justify-between relative">
                    <div className="absolute pattern-dots-sm text-green-500 text-opacity-50 left-0 top-0 w-8 h-8 -ml-4 -mt-1" />
                    <span>Operations</span>
                    <div className="flex flex-row items-center">
                        <span className="text-gray-800">{ operations.length }</span>
                        <button
                            type="button"
                            className={classnames(
                                "border-b-2 p-2 ml-4",
                                operations.length === maxOperations ? "text-gray-800 border-gray-800" : "text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition duration-200"
                            )}
                            disabled={operations.length === maxOperations}
                            onClick={() => { if (operations.length < maxOperations) addOperation({}) }}><FiPlus /></button>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 mt-4">
                    { operations.map((operation, index) => {
                        return (
                            <div key={index} className="flex flex-col border-b-2 border-gray-800">
                                <div className="flex flex-row items-center justify-between mb-2">
                                    <h1 className="text-gray-800">Operation #{index+1}</h1>
                                    <button
                                        type="button"
                                        className={classnames(
                                            "border-b-2 p-2 ml-4",
                                            operations.length === maxOperations ? "text-gray-800 border-gray-800" : "text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                                        )}
                                        onClick={() => removeOperation(index)}><FiMinus /></button>
                                </div>
                                <div className="flex flex-col space-y-2 p-4 pr-0">
                                    <div className="flex flex-row space-x-2 items-center">
                                        <label className="flex-1" htmlFor={`operations[${index}].address`}>Address</label>
                                        <input style={{ flex: 3 }} className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" name={`operations[${index}].address`} placeholder="0x0000...0000" ref={register({ required: true })} />
                                    </div>
                                    <div className="flex flex-row space-x-2 items-center">
                                        <label className="flex-1" htmlFor={`operations[${index}].value`}>Value (ETH)</label>
                                        <input style={{ flex: 3 }} className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" name={`operations[${index}].value`} placeholder="0.0" ref={register({ required: true })} />
                                    </div>
                                    <div className="flex flex-row space-x-2 items-center">
                                        <label className="flex-1" htmlFor={`operations[${index}].signature`}>Signature</label>
                                        <input style={{ flex: 3 }} className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" name={`operations[${index}].signature`} placeholder="Signature" ref={register({ required: true })} />
                                    </div>
                                    <div className="flex flex-row space-x-2 items-center">
                                        <label className="flex-1" htmlFor={`operations[${index}].calldata`}>Calldata</label>
                                        <input style={{ flex: 3 }} className="p-2 px-4 text-white bg-green-900 bg-opacity-25 border-green-500 border-b-2" name={`operations[${index}].calldata`} placeholder="Calldata" ref={register({ required: false })} />
                                    </div>
                                </div>
                            </div>
                        )
                    }) }
                </div>
            </div>
            <input type="submit" value="Submit proposal" className="mt-4 p-2 px-4 text-white hover:bg-green-500 bg-transparent border-b-2 border-green-500 transition duration-200" />
        </form>
    )
}

const NewProposal = () => {

    return (
        <div className="flex flex-col text-gray-500 space-y-8">
            <ProposalsHeader />
            <ProposalForm />
        </div>
    )
}

export default NewProposal