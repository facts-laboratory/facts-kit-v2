# Data-Protocol: Permanent Package

Status: Draft

Authors: jshaw

Version: 0.0.1

## Abstract

A protocol for uploading software packages to the permaweb.

## Specification

- Data-Protocol: "Permanent-Package"
- Content-Type: string
- Programming-Lang: string
- Read-Me (optional): <tx> (tx id of a markdown readme file)
- Docs (optional): <tx> (tx id of a markdown readme file) or <arns> 
- Repository (optional): <tx> or <url>