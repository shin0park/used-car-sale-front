<template>
    <v-card>
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>사고이력</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical>
            <v-tab>
                <v-icon left>mdi-account</v-icon>
                중고차 사고이력 정보(요약)
            </v-tab>
            <v-tab>
                <v-icon left>mdi-lock</v-icon>
                자동차 번호/소유자 변경이력 조회
            </v-tab>
            <v-tab>
                <v-icon left>mdi-access-point</v-icon>
                보험사고이력 상세 정보
            </v-tab>

            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <p class="mb-0">
                            자동차보험 사고기록이 없었다고 해서 반드시 무사고라고 할 수는 없습니다.
                        </p>
                        <v-img src="@/assets/AccidentHistory.png" max-width="40%" max-height="70%"></v-img>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>

                        <p class="mb-0">
                            소유자 변경이력 정보는 개인 간의 소유 변경 이외에도 매매상사 간 변경(상품용)까지 모두 포함된 횟수로 제공됩니다. 참고해주시기 바랍니다.
                        </p>
                        <v-img src="@/assets/Accident1.png" max-width="45%" max-height="70%"></v-img>
                        <v-img src="@/assets/Accident2.png" max-width="45%" max-height="70%"></v-img>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <p class="mb-0">
                            보험금 및 수리(견적)비 출처에 따라서 '가입한 보험사에서 지급된 경우(내차 보험)'와
                            '다른 차량 보험에서 지급된 경우(상대 보험)'로 나뉘어 제공됩니다.
                            자동차사고로 상대 차량 또는 재물에 발생한 손해를 내 보험금에서 지급된 경우의 정보를 제공합니다.
                        </p>

                        <p class="mb-0">
                            * 쌍방과실로 해당 자동차의 손상, 수리 기록이 내차 보험과 상대 보험에서 동시에 처리된 경우에는
                            '내차 보험’ 에만 표시되고 '상대 보험'에서는 생략됩니다.
                        </p>
                        <v-img src="@/assets/ChangeOwnership.png" max-width="40%" max-height="70%"></v-img>
                            <p class="mb-0">
                                위 ‘수리(견적)비용’은 보험사가 지급하는 보험금 중에서 대차료, 휴차료 등 간접손해와 과실상계액 등을
                                제외한 수리 및 견적(부품/공임/도장) 비용으로 실제 지급된 보험금과 차이가 있습니다.
                            </p>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>
<style scoped>

    @media only screen and (min-width: 480px) {
        .mb-0{
            max-width: 49%;
        }

    }
</style>

